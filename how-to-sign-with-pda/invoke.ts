import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import fs from 'node:fs';

const PROGRAM_ID = "DE2XKCromvaC31UGrTgqh9RLY97jpH4528WBjiQR9L8"
const PDA_ID = "6KyppZkwqhWDMffDqhGMdnJPdgbWNW7PemeJ9PUcYoYT"
const WALLET_PATH = "../my-solana-wallet.json";
const RECEIVER_ACCOUNT = "7pFUD7N2f4FHu3XDw5acqBjJ8djjqvCAGYX2ErETNVVL";

(async () => {
  // Solana Devnet에 연결
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  // 배포한 프로그램의 ID와 PDA, 수신 계좌 설정
  const programId = new PublicKey(PROGRAM_ID);   // 배포한 프로그램의 ID
  const pdaAccount = new PublicKey(PDA_ID); // PDA 계정 주소
  const toAccount = new PublicKey(RECEIVER_ACCOUNT);   // SOL을 받을 계정

  const secretKeyString = fs.readFileSync(WALLET_PATH, 'utf8');
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));  // JSON 파싱 후 Uint8Array로 변환
  const payer = Keypair.fromSecretKey(secretKey); // 트랜잭션 수수료를 지불할 지갑

  // Instruction 데이터 설정 (bump seed는 Rust 코드에서 첫 번째 바이트로 사용됨)
  const bumpSeed = 254;  // 실제 bump seed 값 (배포한 프로그램에서 사용한 것과 동일한 값)

  // Transaction Instruction 생성
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: pdaAccount, isSigner: false, isWritable: true }, // PDA 계정
      { pubkey: toAccount, isSigner: false, isWritable: true },  // 송금받을 계정
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 시스템 프로그램 계정
    ],
    programId, // 배포한 프로그램 ID
    data: Buffer.from([bumpSeed]),  // 프로그램에 bump seed 전달
  });

  // 트랜잭션 생성
  let transaction = new Transaction().add(instruction);

  // 트랜잭션 서명 및 전송
  let signature = await connection.sendTransaction(transaction, [payer]);
  await connection.confirmTransaction(signature, 'confirmed');

  console.log('Transaction confirmed with signature:', signature);
})();
