import { useState, useEffect } from 'react';

const getInitialValue = <Type>(key: string, initialValue: Type) => {
    // If there's no 'window' object, the 'localStorage' isn't accessible
    if(typeof window === "undefined") return initialValue;

    const localStorageItem = localStorage.getItem(key);
    if(localStorageItem) return JSON.parse(localStorageItem);

    if(initialValue instanceof Function) return initialValue();
    return initialValue;
}

// Generates a state variable that is stored (and always updated) in localStorage and is initialized with the cached value if it exists
const useLocalStorage = <Type>(key: string, initialValue: Type): [Type, React.Dispatch<React.SetStateAction<Type>>] => {
    const [value, setValue] = useState<Type>(() => getInitialValue<Type>(key, initialValue));

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

export default useLocalStorage
