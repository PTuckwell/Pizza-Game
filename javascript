const pizzas = [
  {
    name: 'Margherita',
    method:
      '1/ Roll the dough base to the required thickness and shape. 2/ Add sauce to the base. 3/ Top with cheese.',
    requiredSteps: ['ROLL DOUGH', 'PIZZA SAUCE', 'CHEESE'],
  },
  {
    name: 'Pepperoni',
    method:
      '1/ Roll the dough base to the required thickness and shape. 2/ Add sauce to the base. 3/ Top with cheese. 4/ Add 12 slices of pepperoni.',
    requiredSteps: ['ROLL DOUGH', 'PIZZA SAUCE', 'CHEESE', 'PEPPERONI'],
  },
  {
    name: 'Ham and Pineapple',
    method:
      '1/ Roll the dough base to the required thickness and shape. 2/ Add sauce to the base. 3/ Top with cheese. 4/ Add 12 pieces of ham. 5/ Add 12 pieces of pineapple.',
    requiredSteps: ['ROLL DOUGH', 'PIZZA SAUCE', 'CHEESE', 'HAM', 'PINEAPPLE'],
  },
  {
    name: 'Chicken',
    method:
      '1/ Roll the dough base to the required thickness and shape. 2/ Add sauce to the base. 3/ Top with cheese. 4/ Add 12 pieces of chicken',
    requiredSteps: ['ROLL DOUGH', 'PIZZA SAUCE', 'CHEESE', 'CHICKEN'],
  },
  {
    name: 'Vegetarian',
    method:
      '1/ Roll the dough base to the required thickness and shape. 2/ Add sauce to the base. 3/ Top with cheese. 4/ Add handful of onions. 5/ Add handful of peppers. 6/ Add small handful of mushrooms. 7/ Add garlic.',
    requiredSteps: [
      'ROLL DOUGH',
      'PIZZA SAUCE',
      'CHEESE',
      'ONIONS',
      'PEPPERS',
      'MUSHROOMS',
      'GARLIC',
    ],
  },
];

let orders = [
  {
    id: 1,
    pizzas: [
      {
        quantity: 1,
        name: 'Ham and Pineapple',
      },
      {
        quantity: 2,
        name: 'Pepperoni',
      },
    ],
  },
  {
    id: 2,
    pizzas: [
      {
        quantity: 2,
        name: 'Margherita',
      },
      {
        quantity: 1,
        name: 'Pepperoni',
      },
    ],
  },
  {
    id: 3,
    pizzas: [
      {
        quantity: 2,
        name: 'Pepperoni',
      },
      {
        quantity: 1,
        name: 'Margherita',
      },
      {
        quantity: 1,
        name: 'Ham and Pineapple',
      },
    ],
  },
];

const ingredients = [
  'ROLL DOUGH',
  'PIZZA SAUCE',
  'CHEESE',
  'PEPPERONI',
  'HAM',
  'PINEAPPLE',
  'ONIONS',
  'PEPPERS',
  'MUSHROOMS',
  'GARLIC',
  'CHICKEN',
];
document.querySelector("#endBtn").style.display = "none"

let oven = [];
const ovenCapacity = 6;
let pizzaCompletedForOrder = 0;
let gameStarted = false;
const gameLength = 300;
let countdownTime = gameLength;
const cookingTime = 20;
let completedPizzas = 0;
let completedSteps = [];
let wastedPizzas = 0;

document.querySelector("#gameLength").innerText = `Game length is ${gameLength} seconds`


function createListOfPizzas(pizzas) {
  const pizzaList = document.createElement('ul')
  pizzas.forEach(function (pizza) {
    const orderQuantityEl = buildElement("span", `${pizza.quantity} - `)
    const pizzaNameEl = buildElement("span", pizza.name)
    pizzaNameEl.classList.add("pizza_name")
    //create list item to show quantity and pizza name
    const pizzaItem = document.createElement('li')
    pizzaItem.append(orderQuantityEl, pizzaNameEl)
    pizzaList.appendChild(pizzaItem)
  });
  return pizzaList
}

function createSingleOrder(order) {
  //Wrapper
  const orderWrapper = document.createElement('div')
  orderWrapper.className = "order_wrapper"
  orderWrapper.addEventListener("click", selectCurrentOrder)
  //order Number
  const orderNumberEl = buildElement("h4", `Order: ${order.id}`)
  orderWrapper.appendChild(orderNumberEl)
  //create Pizza ul for each order
  const pizzaList = createListOfPizzas(order.pizzas)
  orderWrapper.appendChild(pizzaList);
  return orderWrapper;
}

function createOrdersList() {
  document.querySelector("#orders").innerHTML = "";
  orders.forEach(function (order) {
    const singleOrder = createSingleOrder(order);
    document.querySelector('#orders').appendChild(singleOrder)
  });

};

function selectCurrentOrder(e) {
  const pizzas = document.querySelectorAll(".pizza_name")
  pizzas.forEach(function (pizza) {
    pizza.addEventListener("click", setCurrentPizza)
  })
  if (document.querySelector("#working_on").children.length > 1) return
  let element = e.target
  const orderWrapper = element.closest(".order_wrapper")
  if (orderWrapper !== null) {
    orderWrapper.removeEventListener("click", selectCurrentOrder)
    const orderDiv = document.querySelector("#working_on")
    orderDiv.appendChild(orderWrapper)
  }

}

function buildElement(elementName, elementContent) {
  const element = document.createElement(elementName)
  const content = document.createTextNode(elementContent)
  element.appendChild(content)
  return element
}

function setCurrentPizza(e) {
  const pizzaName = e.target.innerText
  document.querySelector("#current_pizza").innerText = pizzaName

  displayMethod(pizzaName)
}

function displayMethod(pizzaName) {
  document.querySelector("#pizza_name").innerHTML = pizzaName;
  const selectedPizza = pizzas.find((pizza) => pizza.name === pizzaName)
  const methodSteps = selectedPizza.method.split(".")
  document.querySelector("#pizza_method").innerHTML = " "
  methodSteps.forEach(function (method) {
    const steps = buildElement("p", method)
    document.querySelector("#pizza_method").appendChild(steps)
  })
}

function displayOvenItems() {
  document.querySelector("#oven").innerHTML = ""
  oven.forEach(function (pizza) {
    const pizzaDiv = document.createElement("div")
    pizzaDiv.className = "pizza_div"
    const image = document.createElement("img")
    image.src = "pizza.svg"
    const pizzaName = buildElement("p", `${pizza.name}`)
    pizzaDiv.append(image, pizzaName)
    document.querySelector("#oven").appendChild(pizzaDiv)
  })
}

function addToOven() {
  pizzaCompletedForOrder++
  const pizzaName = document.querySelector("#current_pizza").innerText
  if (pizzaName) {
    const canAddToOven = stepsCompleted(pizzaName)
    if (canAddToOven) {
      const pizzaForOven = {
        name: pizzaName,
        timeAdded: Date.now()
      };
      oven.push(pizzaForOven)
      displayOvenItems()
      clearCanvas()
      completedSteps = []
    }
  }

}

function stepsCompleted(pizzaName) {
  const pizzaObject = pizzas.find(function (pizza) {
    return pizza.name === pizzaName;
  });
  const stepsRequired = pizzaObject.requiredSteps;

  const checkSteps = stepsRequired.every(function (element, index) {
    return element === completedSteps[index]
  });
  if (completedSteps.length > stepsRequired.length) {
    showErrorMessage("You have used too many ingredients")
    wastedPizza();
    return
  }
  if (completedSteps.length < stepsRequired.length) {
    showErrorMessage("You have not used enough ingredients")
    return
  }
  if (completedSteps.length === stepsRequired.length && !checkSteps) {
    showErrorMessage("You have used the wrong ingredients")
    wastedPizza();
    return
  }

  if (oven.length < ovenCapacity) {
    return true;
  }
  return false;
}

function showErrorMessage(message) {
  document.querySelector("#message").innerText = message;
  setTimeout(function () {
    document.querySelector("#message").innerText = "";
  }, 2000)
}

function startOfGame() {
  if (gameStarted) {
    return
  }
  document.querySelector("#startBtn").style.display = "none"
  document.querySelector("#endBtn").style.display = "inline"
  gameStarted = true
  const orders = document.getElementsByClassName("order_wrapper")
  Array.from(orders).forEach(function (order) {
    order.remove()
  })
  createOrdersList();
  ordersTimer()
  countdownTimer()
  gameTimer();
  countdownTimerRef = setInterval(countdownTimer, 1000);
  document.querySelector("#message").innerText = "Chef, our first orders are coming in"
  setTimeout(function () {
    document.querySelector("#message").innerText = "";
  }, 3000)
  checkOven();
  listIngredients()
}
function endOfGame() {
  gameStarted = false;
  clearInterval(orderTimerRef);
  clearInterval(countdownTimerRef);
  clearTimeout(gameTimerRef)
  document.querySelector("#startBtn").style.display = "inline"
  document.querySelector("#endBtn").style.display = "none"
}

document.querySelector("#addToOven").addEventListener("click", addToOven);
document.querySelector("#startBtn").addEventListener("click", startOfGame)
document.querySelector("#endBtn").addEventListener("click", endOfGame)

let orderNumber = orders.length + 1

function generateNewOrder() {
  let pizzas = [];
  const orderItem = Math.ceil(Math.random() * 5)
  for (i = 1; i <= orderItem; i++) {
    pizzas.push(generateNewPizza())
  }
  const newOrder = {
    id: orderNumber,
    pizzas,
  }
  orders.push(newOrder)
  orderNumber++
  createOrdersList()
}

function generateNewPizza() {
  const quantity = Math.ceil(Math.random() * 3)
  // 0-pizzas.length
  const randomPizza = pizzas[Math.floor(Math.random() * pizzas.length)]

  const pizza = {
    quantity,
    name: randomPizza.name
  };
  return pizza;
}

let orderTimerRef = ""
function ordersTimer() {
  orderTimerRef = setInterval(generateNewOrder, 3000);
}


let countdownTimerRef = ""
function countdownTimer() {
  countdownTime -= 1;
  document.querySelector("#gameLength").innerText = `Time left: ${countdownTime}`
}

let gameTimerRef = ""
function gameTimer() {
  gameTimerRef = setTimeout(endOfGame, gameLength * 1000)
}

function checkOven() {
  setInterval(function () {
    oven.forEach(function (pizza) {
      if (Date.now() - cookingTime * 1000 > pizza.timeAdded) {
        oven.shift()
        displayOvenItems();
        completedPizzas++;
      }
    })
  }, 1000)
};

const canvas = document.querySelector('#pizza_area')
const ctx = canvas.getContext("2d")

function listIngredients() {
  ingredients.forEach(function (ingredient) {
    const ingredientElement = buildElement("button", ingredient)
    ingredientElement.className = "ingredient"
    ingredientElement.addEventListener("click", stepComplete)
    document.querySelector("#ingredients").appendChild(ingredientElement)
  })
}

function stepComplete(e) {
  e.target.setAttribute("disabled", true)
  const stepName = e.target.innerText;
  completedSteps.push(stepName)
  makePizza(stepName)
}

function makePizza(ingredient) {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  switch (ingredient) {
    case "ROLL DOUGH":
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI)
      ctx.lineWidth = 15
      ctx.strokeStyle = "#f5cf89"
      ctx.stroke();
      ctx.fillStyle = "#f5d69d";
      ctx.fill();
      break;
    case "PIZZA SAUCE":
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI)
      ctx.fillStyle = "#ed4434"
      ctx.fill()
      break;
    case "CHEESE":
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 95, 0, 2 * Math.PI)
      ctx.fillStyle = "#f7bc4d"
      ctx.fill()
      break;
    case "PEPPERONI":
      const pepperoniPositions = [
        [78, 62],
        [118, 74],
        [147, 57],
        [116, 134],
        [125, 190],
        [162, 165],
        [190, 85],
        [102, 142],
        [150, 115],
        [76, 95],
        [80, 195],
        [65, 144],
      ];
      pepperoniPositions.forEach(function (piece) {
        ctx.beginPath();
        ctx.arc(piece[0], piece[1], 10, 0, Math.PI * 2)
        ctx.fillStyle = "#db3611"
        ctx.fill()
      })
      break;
    case "HAM":
      const hamPositions = [
        [81, 62],
        [108, 74],
        [147, 47],
        [130, 124],
        [125, 160],
        [159, 145],
        [197, 82],
        [202, 132],
        [158, 90],
        [90, 140],
        [105, 135]
      ];
      hamPositions.forEach(function (piece) {
        ctx.fillStyle = "#f58c8c";
        ctx.rotate((Math.random() * 2 * Math.PI) / 180)
        ctx.fillRect(piece[0], piece[1], 8, 32)
      })
      break;
    case "PINEAPPLE":
      const pineapplePositions = [
        [81, 62],
        [108, 74],
        [147, 47],
        [130, 124],
        [125, 160],
        [159, 145],
        [197, 82],
        [202, 132],
        [158, 90],
        [90, 140],
        [105, 135]
      ];
      pineapplePositions.forEach(function (piece) {
        ctx.fillStyle = "#ebe534";
        ctx.rotate((Math.random() * 2 * Math.PI) / 180)
        ctx.fillRect(piece[0], piece[1], 12, 18)
      })
      break;
    case "ONIONS":
      const onionPositions = [
        [65, 62],
        [63, 125],
        [165, 82],
        [165, 56],
        [93, 124],
        [133, 155],
        [195, 155],
        [75, 135],
        [110, 142],
        [65, 103],
        [63, 159],
        [159, 123],
      ];
      onionPositions.forEach(function (piece) {
        ctx.beginPath();
        ctx.arc(piece[0], piece[1], 1, 0, Math.PI * 2)
        ctx.strokeStyle = "#89676D"
        ctx.stroke()
      })
      break;
    case "PEPPERS":
      const pepperPositions = [
        [130, 62],
        [148, 125],
        [165, 107],
        [133, 56],
        [129, 124],
        [75, 155],
        [195, 66],
        [140, 135],
        [110, 89],
        [65, 155],
        [115, 159],
        [159, 156],
      ];
      pepperPositions.forEach(function (piece) {
        ctx.beginPath();
        ctx.arc(piece[0], piece[1], 1.5, 0, Math.PI * 2)
        ctx.strokeStyle = "#74c451"
        ctx.stroke()
      })

      break;
    case "MUSHROOMS":
      const mushroomPositions = [
        [99, 62],
        [118, 97],
        [79, 57],
        [116, 114],
        [62, 190],
        [162, 80],
        [122, 165],
        [102, 86],
        [124, 115],
        [76, 151],
        [80, 145],
        [65, 157],
      ];
      mushroomPositions.forEach(function (piece) {
        ctx.beginPath();
        ctx.arc(piece[0], piece[1], 8, 0, Math.PI * 2)
        ctx.fillStyle = "#a1a0a0"
        ctx.fill()
      })
      break;
    case "GARLIC":
      const garlicPositions = [
        [99, 119],
        [109, 97],
        [116, 142],
        [116, 62],
        [62, 121],
        [107, 80],
        [122, 150],
        [141, 86],
        [124, 108],
        [111, 151],
        [138, 145],
        [65, 77],
      ];
      garlicPositions.forEach(function (piece) {
        ctx.beginPath();
        ctx.arc(piece[0], piece[1], 6, 0, Math.PI * 2)
        ctx.fillStyle = "#fff6c9"
        ctx.fill()
      })
      break;
    case "CHICKEN":
      const chickenPositions = [
        [110, 62],
        [108, 109],
        [127, 47],
        [102, 124],
        [140, 160],
        [159, 77],
        [140, 82],
        [202, 69],
        [158, 157],
        [90, 78],
        [114, 135]
      ];
      chickenPositions.forEach(function (piece) {
        ctx.fillStyle = "#e9cc75";
        ctx.rotate((Math.random() * 2 * Math.PI) / 180)
        ctx.fillRect(piece[0], piece[1], 14, 18)
      })
      break;
  }
}

function clearCanvas() {
  const steps = document.getElementsByClassName("ingredient")
  Array.from(steps).forEach(function (element) {
    element.removeAttribute("disabled");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  })
}

function wastedPizza() {
  wastedPizzas++;
  completedSteps = [];
  clearCanvas();
}

document.querySelector("#waste").addEventListener("click", wastedPizza);
