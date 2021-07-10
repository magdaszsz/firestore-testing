const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("form");
const date = document.querySelector("#date");
const timestamp = new Date().toISOString().split("T")[0];
const tasksCont = document.querySelector(".tasks-container");
date.setAttribute("min", timestamp);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("tasks").add({
    task: form.task.value,
    deadline: form.date.value,
  });

  form.reset();
});

const renderTasks = (task) => {
  const div = document.createElement("div");
  div.className = "task";
  const p = document.createElement("p");
  const header = document.createElement("h2");
  const button = document.createElement("button");
  button.textContent = "X";
  p.textContent = task.data().deadline;
  header.textContent = task.data().task;
  div.appendChild(header);
  div.appendChild(p);
  div.appendChild(button);
  tasksCont.appendChild(div);
  button.addEventListener("click", (e) => {
    const id = task.id;
    console.log(id);
    db.collection("tasks").doc(id).delete();
  });
};

db.collection("tasks").onSnapshot((snapshot) => {
  tasksCont.innerHTML = "";
  snapshot.docs.forEach(renderTasks);
});

db.collection("tasks")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      renderTasks(doc);
    });
  });
