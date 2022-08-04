const typeColors = {
    normal:"#64ff00",
    fighting:"#8f8b52",
    flying:"#baf8ff9e",
    poison:"#3f5a4b",
    ground:"#543610",
    rock:"#919d9b",
    bug:"#25a743",
    ghost:"#c2c2c27e",
    steel:"#8f8f8f",
    fire:"#d45656",
    water:"#3da8e6",
    grass:"#4ace45",
    electric:"#e9e152",
    psychic:"#9b33ad",
    ice:"#51b6ff",
    dragon:"#9d36b2",
    dark:"#171616",
    fairy:"#d94ccd",
    unknown:"#000000",
    shadow:"#312e2e",
}

export function getTypeColor(name){
    const color = typeColors[name]
    console.log(name+': '+color)
    return color
}