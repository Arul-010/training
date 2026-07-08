let bikes=["tvs","hero","bajaj","honda","yamaha"];
const[first,second,third,fourth,fifth]=bikes;
console.log(first,second,third);
//...(spread operator)
let bike2=[...bikes];
let fruit=["apple"];
let veg=["carrots"];
let merge=[...fruit,...veg];

const employee={
    id:101,
    name:"arul"
};
const info={
    salary:10000,
    exp:7
};
const copyemp={
    ...employee,...info
}
console.log(copyemp);

