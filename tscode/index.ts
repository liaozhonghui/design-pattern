enum Sex {
  Man,
  Woman,
  Unknow
}
interface Person {
  name: string,
  age: number,
  sex: Sex,
}
type pPerson = Partial<Person>
function Hello(name: string) {
  console.log('hello:', name);
}

const p: pPerson = {
  name: 'wang',
  age: 2
}
// Hello(p.name)
