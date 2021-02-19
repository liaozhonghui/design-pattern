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

type ListNode<T> = {
  data: T,
  next: ListNode<T> | null
}

type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

type PartialPerson = DeepPartial<Person>

