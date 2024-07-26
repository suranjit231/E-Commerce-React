import React, { useState } from "react";
import styles from "./authForm.module.css";
import { useAuthContext } from "../../component/context/authContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AuthForm(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignupForm, setSignUpForm] = useState(false);
    const navigate  = useNavigate();
  //  const{setShowAuthForm,  isShowAuth} = props;

    const {isLoggedIn, user, signup, signin, setShowAuthForm,  isShowAuth} = useAuthContext();
    //console.log("access auth context in authform: ", value);

    
    function toggleSignInAndSignUp(){
        console.log("toggle sign in signup called");
        setSignUpForm((prev)=>!prev, console.log("isSignUp Form: ", isSignupForm));
    }

    // Function to handle sign-in or sign-up form submission
    async function handleAuthFormSubmit(e) {
        e.preventDefault();

        if(isSignupForm){

            if(!name.trim() || !email.trim() || !password.trim()) return;


           const result=await signup({name:name, email:email, password:password});
           if(result){
            
            clearInput();
            toggleSignInAndSignUp();
            toast.success("SignUp sucessfully!")
           }
            
        }else{

            try {

                if(!email.trim() || !password.trim()) return;
               const result=await signin({email:email, password:password});
               console.log("result: ", result);

                if(result){
                    clearInput();
                    toast.success("Login sucessfully!");
                    navigate('/'); 
        
                }

              } catch (error) {
                console.error("Error signing in", error);
                toast.error("Login failds");
              }
           
        }
       
    }

    //======== function clear input ===========//
    function clearInput(){
        setName("");
        setEmail("");
        setPassword("");
    }

    return (
        <div className={styles.authFormContainer}>
            <form onSubmit={handleAuthFormSubmit}>
                <h2>{isSignupForm? "Sign Up": "Sign In"}</h2>
                <div className={styles.authFormBox}>

                    {isSignupForm?(
                        <div className={styles.formControlDiv}>
                        <label htmlFor="name"><i className="fa-regular fa-user"></i></label>
                        <input type="text" name="name" id="name" value={name}
                            onChange={(e) => setName(e.target.value)} placeholder="User name..." />
                        </div>
                    ):null}
                    
                    <div className={styles.formControlDiv}>
                        <label htmlFor="email"><i className="fa-regular fa-envelope"></i></label>
                        <input type="text" name="email" id="email" value={email}
                            onChange={(e) => setEmail(e.target.value)} placeholder="User email..." />
                    </div>

                    <div className={styles.formControlDiv}>
                        <label htmlFor="password"><i className="fa-solid fa-unlock-keyhole"></i></label>
                        <input type="password" name="password" id="password" value={password}
                            onChange={(e) => setPassword(e.target.value)} placeholder="User password..." />
                    </div>

                    <div className={styles.formControlBtnDiv}>
                        <button type="submit">
                        {isSignupForm? "Sign Up": "Sign In"}
                        </button>
                    </div>
                </div>
            </form>

            <div className={styles.redirectAuthDiv}>
                {isSignupForm ? (
                    <>All ready have an account <span onClick={()=>toggleSignInAndSignUp()} >SignIn</span></>
                ) : (
                    <>Don't have an account? <span onClick={()=>toggleSignInAndSignUp()} >SignUp</span></>
                )}
            </div>

        </div>
    );
}
