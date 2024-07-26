import { createContext, useContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../../../firebaseInit";
import { doc, setDoc } from 'firebase/firestore';
import { toast } from "react-toastify";

const AuthContext = createContext();

export function useAuthContext() {
    return useContext(AuthContext);
}

export function AuthContextProvider({ children }) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { displayName, email, uid } = user;
                setLoggedIn(true);
                setUser({ name: displayName, email, id: uid });
                localStorage.setItem('user', JSON.stringify({ name: displayName, email, id: uid }));
            } else {
                setLoggedIn(false);
                setUser(null);
                localStorage.removeItem('user');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
