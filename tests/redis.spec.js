const { getCode, updateCode, roomExistQuery } = require('../redis');

describe('Redis', () => {
  it('Update code in a test room then get the code in the same room', async () => {
    await updateCode('TEST_ROOM', 'TEST_CODE');
    const code = await getCode('TEST_ROOM');
    expect(code).toBe('TEST_CODE');
  });

  it('Query a nonexistent room then return false', async () => {
    const res = await roomExistQuery('NO_EXIST_ROOM');
    expect(res).toBeFalsy();
  });

  it('Query an exist room then return true', async () => {
    await updateCode('TEST_ROOM_2', 'TEST_CODE');
    const res = await roomExistQuery('TEST_ROOM_2');
    expect(res).toBeTruthy();
  });
});
