import { promises as fsPromises } from 'fs';
import * as Store from './store';

describe('Store caching', () => {
  let contact: Omit<Store.Contact, 'id'>;
  beforeEach(async () => {
    // Clean up all contacts before each test
    const all = await Store.readAll();
    for (const c of all) {
      await Store.remove(c.id);
    }
    contact = {
      name: 'Test User',
      email: `test${Math.random()}@example.com`,
      phone: '1234567890',
      subject: 'Test',
      message: 'Hello',
      consent: true,
    };
  });

  it('caches contacts for repeated reads', async () => {
    // Clear cache by adding and removing a contact
    const added = await Store.add({ ...contact, email: `unique${Math.random()}@example.com` });
    await Store.remove(added.id);
    // Spy after cache is cleared
    const spy = jest.spyOn(fsPromises, 'readFile');
    await Store.readAll(); // should read from disk
    await Store.readAll(); // should use cache
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('invalidates cache on add', async () => {
    await Store.readAll();
    await Store.add(contact);
    // After add, cache should be invalidated, so next readAll reads from disk
    const spy = jest.spyOn(fsPromises, 'readFile');
    await Store.readAll();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('invalidates cache on update', async () => {
    const added = await Store.add(contact);
    await Store.readAll();
    await Store.update(added.id, { ...contact, name: 'Updated' });
    const spy = jest.spyOn(fsPromises, 'readFile');
    await Store.readAll();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('invalidates cache on remove', async () => {
    const added = await Store.add(contact);
    await Store.readAll();
    await Store.remove(added.id);
    const spy = jest.spyOn(fsPromises, 'readFile');
    await Store.readAll();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
