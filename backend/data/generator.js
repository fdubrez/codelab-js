const data = require("./data");

function randStat(min, max) {
  return Math.floor(Math.random() * max) + min;
}

const generated = data.map(x => {
  let agility, intellect, strength, health;
  switch (x.race) {
    case "Dwarf":
      agility = randStat(20, 30);
      intellect = randStat(5, 15);
      strength = randStat(50, 100);
      health = randStat(100, 200);
      break;
    case "Sindarin":
      agility = randStat(60, 80);
      intellect = randStat(60, 90);
      strength = randStat(40, 65);
      health = randStat(60, 110);
      break;
    case "Hobbit":
      agility = randStat(45, 55);
      intellect = randStat(40, 50);
      strength = randStat(15, 45);
      health = randStat(35, 60);
      break;
    case "Rohirrim":
      agility = randStat(45, 60);
      intellect = randStat(50, 55);
      strength = randStat(50, 65);
      health = randStat(80, 130);
      break;
  }

  return {
    ...x,
    agility,
    intellect,
    strength,
    health
  };
});

console.log(JSON.stringify(generated));
