interface Wallet {
  privateKey: string;
  publicKey: string;
  address: string;
  qrCode: string;
}

interface Mnemonic {
  id: number;
  mnemonic: string;
}
