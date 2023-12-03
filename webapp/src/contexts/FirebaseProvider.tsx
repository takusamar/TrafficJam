import { ReactNode, useEffect, useState } from "react";
import { getApp, initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";
import { CircularProgress } from "@material-ui/core";
import { FirebaseAppProvider, FirestoreProvider, useFirebaseApp } from "reactfire";
import { getFirestore } from "firebase/firestore";

export const FirebaseProvider = (props: { children: ReactNode }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      initializeApp(firebaseConfig);
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded) {
    return <CircularProgress />
  } else {
    return (
      <FirebaseAppProvider firebaseApp={getApp()}>
        <FirebaseProviderSub>{props.children}</FirebaseProviderSub>
      </FirebaseAppProvider>
    );
  }
}

const FirebaseProviderSub = (props: { children: ReactNode }) => {
  const app = useFirebaseApp();
  const firestore = getFirestore(app);
  return (
    <FirestoreProvider sdk={firestore}>
      {props.children}
    </FirestoreProvider>
  )
}