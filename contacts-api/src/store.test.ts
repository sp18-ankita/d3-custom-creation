import { promises as fsPromises } from 'fs';
import * as Store from './store';

// Mock fs.promises completely
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    mkdir: jest.fn(),
    writeFile: jest.fn(),
    readFile: jest.fn().mockResolvedValue('[]'),
  },
}));

describe('Store caching', () => {
  let contact: Omit<Store.Contact, 'id'>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Reset mock readFile to return empty array
    (fsPromises.readFile as jest.Mock).mockResolvedValue('[]');

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
    // Set up mock data
    const mockData = '[]';
    (fsPromises.readFile as jest.Mock).mockResolvedValue(mockData);

    await Store.readAll(); // should read from disk
    await Store.readAll(); // should use cache

    expect(fsPromises.readFile).toHaveBeenCalledTimes(1);
  });

  it('invalidates cache on add', async () => {
    // Initial empty state
    (fsPromises.readFile as jest.Mock).mockResolvedValue('[]');

    await Store.readAll();
    await Store.add(contact);

    // After add, cache should be invalidated
    const spy = jest.spyOn(fsPromises, 'readFile');
    await Store.readAll();
    expect(spy).toHaveBeenCalled();
  });

  it('invalidates cache on update', async () => {
    // Set up initial state with one contact
    const added = await Store.add(contact);
    const initialState = JSON.stringify([{ ...contact, id: added.id }]);
    (fsPromises.readFile as jest.Mock).mockResolvedValue(initialState);

    await Store.readAll();
    await Store.update(added.id, { ...contact, name: 'Updated' });

    const spy = jest.spyOn(fsPromises, 'readFile');
    await Store.readAll();
    expect(spy).toHaveBeenCalled();
  });

  it('invalidates cache on remove', async () => {
    // Set up initial state with one contact
    const added = await Store.add(contact);
    const initialState = JSON.stringify([{ ...contact, id: added.id }]);
    (fsPromises.readFile as jest.Mock).mockResolvedValue(initialState);

    await Store.readAll();
    await Store.remove(added.id);

    const spy = jest.spyOn(fsPromises, 'readFile');
    await Store.readAll();
    expect(spy).toHaveBeenCalled();
  });

  describe('CRUD operations', () => {
    it('adds contact successfully', async () => {
      const result = await Store.add(contact);
      expect(result).toMatchObject(contact);
      expect(result.id).toBeDefined();
    });

    it('prevents duplicate emails', async () => {
      await Store.add(contact);
      await expect(Store.add(contact)).rejects.toThrow('Email already exists');
    });

    it('updates contact successfully', async () => {
      const added = await Store.add(contact);
      const updated = await Store.update(added.id, { ...contact, name: 'Updated' });
      expect(updated.name).toBe('Updated');
    });

    it('prevents updating to existing email', async () => {
      await Store.add(contact); // Add first contact
      const contact2 = await Store.add({ ...contact, email: 'other@example.com' });
      await expect(Store.update(contact2.id, { ...contact })).rejects.toThrow(
        'Another contact with this email already exists',
      );
    });

    it('removes contact successfully', async () => {
      const added = await Store.add(contact);
      const result = await Store.remove(added.id);
      expect(result).toBe(true);
      const found = await Store.getById(added.id);
      expect(found).toBeUndefined();
    });
  });
});
