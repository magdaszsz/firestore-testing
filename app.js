const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");
const userDetails = document.getElementById("userDetails");

auth.onAuthStateChanged((user) => {
  if (user) {
    // signed in
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
  } else {
    // not signed in
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = "";
  }
});




// db.collection('cafes').orderBy('city').get().then(snapshot => {
//   snapshot.docs.forEach(element => {
//     renderCafe(element)
//   });
// })

db.collection("cafes").orderBy("city").onSnapshot(snapshot => {
    cafeList.innerHTML = ""; // clear the list
    snapshot.docs.forEach(renderCafe);
})

/// create element and render cafe

function renderCafe(doc) {
  let li = document.createElement('li');
  let name = document.createElement('span');
  let city = document.createElement('span');
  let cross = document.createElement('div');


  li.setAttribute('data-id', doc.id)
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = 'x';

  li.appendChild(name)
  li.appendChild(city)
  li.appendChild(cross)
  cafeList.appendChild(li)

  // deleting data
  cross.addEventListener('click', (e) => {
    let id = doc.id; // to poprawka od widzów
    db.collection('cafes').doc(id).delete();
  })
}

//saving data

form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('cafes').add({
    name : form.name.value,
    city: form.city.value
  })
  form.reset();
})