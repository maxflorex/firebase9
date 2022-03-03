import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp,
    getDoc,
    updateDoc,

} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBTIlcK6Gg-DLqk-gKXO-nh7gLy7Pp2uWw",
    authDomain: "firetest-924d0.firebaseapp.com",
    projectId: "firetest-924d0",
    storageBucket: "firetest-924d0.appspot.com",
    messagingSenderId: "22570025871",
    appId: "1:22570025871:web:7d0ac392a1f031ad9dc1fa"
};




// INITI FIREBASE
initializeApp(firebaseConfig)




// INIT SERVICES
const db = getFirestore()
const auth = getAuth()




// COLLECTION REF
const colRef = collection(db, 'books')




// QUERIES
// const q = query(colRef, where("author", '==', 'Ye'), orderBy('title', 'desc'))
const q = query(colRef, orderBy('createdAt'))




// GET REAL TIME COLLEC TION DATA
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
})




// ADDING DOCUMENTS
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
        .then(() => {
            addBookForm.reset()
        })
})




// DELETING DOCUMENTS
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value)

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset()
        })
})




// GET SINGLE DOC

const docRef = doc(db, 'books', 'us120PyrUhQAsqYgQ4Ak')
// getDoc(docRef)
//     .then((doc) => {
//         console.log(doc.data(), doc.id)
//     })
const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})





// UPDATING A DOCUMENT
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    let docRef = doc(db, 'books', updateForm.id.value)

    updateDoc(docRef, {
        title: 'updated title'
    })
        .then(() => {
            updateForm.reset()
        })
})




// SIGNING UP
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
        .then(cred => {
            // console.log('user created:', cred.user)
            signupForm.reset()
        })
        .catch(err => {
            console.log(err.message)
        })
})





// SIGNING IN & OUT
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            //   console.log('user signed out')
        })
        .catch(err => {
            console.log(err.message)
        })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
        .then(cred => {
            console.log('user logged in:', cred.user)
            loginForm.reset()
        })
        .catch(err => {
            console.log(err.message)
        })
})





// SUBSCRIBING TO AUTH CHANGES
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('User status changed:', user)
})





// UNSUSCRIBING
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
    console.log('unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
})