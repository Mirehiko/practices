const isFetching: boolean = true;
const isLoading: boolean = false;

const int: number = 42;
const float: number = 4.2;
const num: number = 3e10;
const message: string = "It's a typescript bitch";

const numArr: number[] = [1, 1, 2, 3, 5, 6, 13];
const numArr2: Array<number> = [1, 1, 2, 3, 5, 6, 13];
const words: Array<string> = ["it's", 'ts', 'bitch'];

//Tuple
const contact: [string, number] = ['Name', 79999];

//Any
let variable: any = 42;
//...
variable = 'make string';
variable = [];

function sayMyName(name: string): void {
  console.log(name);
}

sayMyName('Guff');

//Never
function throwError(msg: string): never {
  throw new Error(msg);
}

//Type

type Login = string;
const login: Login = 'admin';
type ID = string | number;
const id1: ID = 1234;
const id2: ID = '_1234';

//===================================
//Interfaces
interface Rect {
  readonly id: string;
  color?: string;
  size: {
    width: number;
    height: number;
  };
}

const rect1: Rect = {
  id: '1234',
  size: {
    width: 20,
    height: 30
  },
  color: '#ccc'
};

const rect2 = {} as Rect;
const rect3 = <Rect>{};

interface RectWithArea extends Rect {
  getArea: () => number;
}
const rect4: RectWithArea = {
  id: '123',
  size: {
    width: 20,
    height: 20
  },
  getArea(): number {
    return this.size.width * this.size.height;
  }
};

// Classes
interface IClock {
  time: Date;
  setTime(date: Date): void;
}
class Clock implements IClock {
  time: Date = new Date();

  setTime(date: Date): void {
    this.time = date;
  }
}

interface Styles {
  [key: string]: string;
}
const css: Styles = {
  boder: '1px solid black',
  marginTop: '2px',
  borderRadius: '5px'
};

// enums
enum Membership {
  Simple,
  Standard,
  Premium
}

const memembership = Membership.Standard;
const mememberReverse = Membership[2];

console.log(memembership);
console.log(mememberReverse);

enum SocialMedia {
  VK = 'VK',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM'
}

const social = SocialMedia.INSTAGRAM;
console.log(social);

type User = {
  _id: number;
  name: string;
  email: string;
  createdAt: Date;
};

type UserKeysNoMeta1 = Exclude<keyof User, '_id' | 'createdAt'>; // 'name' | 'email'
type UserKeysNoMeta2 = Pick<User, 'name' | 'email'>; // 'name' | 'email'

let u1: UserKeysNoMeta1 = 'name';

console.log(u1);
