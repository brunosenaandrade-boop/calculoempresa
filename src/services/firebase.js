import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, getDoc, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'

// Configuracao do Firebase - Substitua com suas credenciais
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Referencias das colecoes
export const collections = {
  configuracoes: 'configuracoes',
  insumos: 'insumos',
  pratos: 'pratos',
  vendas: 'vendas',
  custosFixos: 'custosFixos',
  despesasNaoOperacionais: 'despesasNaoOperacionais'
}

// Funcoes de CRUD genericas
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Erro ao adicionar documento:', error)
    throw error
  }
}

export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
    return { id: docId, ...data }
  } catch (error) {
    console.error('Erro ao atualizar documento:', error)
    throw error
  }
}

export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId))
    return true
  } catch (error) {
    console.error('Erro ao deletar documento:', error)
    throw error
  }
}

export const getDocument = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId))
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Erro ao buscar documento:', error)
    throw error
  }
}

export const getDocuments = async (collectionName, conditions = []) => {
  try {
    let q = collection(db, collectionName)

    if (conditions.length > 0) {
      q = query(q, ...conditions)
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Erro ao buscar documentos:', error)
    throw error
  }
}

// Listener em tempo real
export const subscribeToCollection = (collectionName, callback, conditions = []) => {
  let q = collection(db, collectionName)

  if (conditions.length > 0) {
    q = query(q, ...conditions)
  }

  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(docs)
  }, (error) => {
    console.error('Erro no listener:', error)
  })
}

// Helpers do Firestore
export { db, collection, doc, query, where, orderBy, Timestamp }
export default app
