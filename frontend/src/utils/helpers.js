const rsaAlgo = import.meta.env.VITE_RSA_ALGO;
const modulusLength = import.meta.env.VITE_MODULUS_LENGTH;
const publicExponent = JSON.parse(import.meta.env.VITE_PUBLIC_EXPONENT);
const hashAlgo = import.meta.env.VITE_HASH_ALGO;

// Used in otp verification form for showing the time
export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
};

// Used in the chatSidebar
export const formatDate = (date) => {
    const now = new Date();
    const messageDate = new Date(date);

    if (
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear()
    ) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      const day = messageDate.getDate().toString().padStart(2, "0");
      const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
      const year = messageDate.getFullYear().toString().slice(2);
      return `${day}/${month}/${year}`;
    }
  };

  export const generateKeys = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: rsaAlgo,
        modulusLength: modulusLength,
        publicExponent: new Uint8Array(publicExponent),
        hash: hashAlgo,
      },
      true,
      ["encrypt","decrypt"],
    );
    return keyPair;
  }

  export const exportKeys = async (publicKey, privateKey) => {
    const exportedPublicKey = await window.crypto.subtle.exportKey(
      "jwk",
      publicKey
    );
    const exportedPrivateKey = await window.crypto.subtle.exportKey(
      "jwk",
      privateKey
    );
  
    return {
      publicKey: exportedPublicKey,
      privateKey: exportedPrivateKey,
    };
  };

  // Used for checking the time
  export const canPerformAction = (lastActionTime, cooldownInMillis = 3600000) => {
    if (!lastActionTime) return true;
    const currentTime = Date.now();
    return currentTime - lastActionTime >= cooldownInMillis;
  };

  export const formatTimeForClock = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };