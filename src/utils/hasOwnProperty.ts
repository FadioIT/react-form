const { hasOwnProperty } = Object.prototype;

export default (a: object, key: string | symbol) => hasOwnProperty.call(a, key);
