import hasOwnProperty from './hasOwnProperty';

describe('hasOwnProperty', () => {
  it('should return true in an object has a property with given name', () => {
    expect(hasOwnProperty({ a: 1 }, 'a')).toBe(true);
  });

  it('should return false in an object has not a property with given name', () => {
    expect(hasOwnProperty({ a: 1 }, 'b')).toBe(false);
  });

  it('should not return true if the property is inherited from prototype', () => {
    expect(hasOwnProperty(Object.create({ a: 1 }), 'a')).toBe(false);
  });

  it('should works on object with null prototype', () => {
    const obj = Object.assign(Object.create(null), { a: 1 });
    expect(hasOwnProperty(obj, 'a')).toBe(true);
    expect(hasOwnProperty(obj, 'b')).toBe(false);
  });
});
