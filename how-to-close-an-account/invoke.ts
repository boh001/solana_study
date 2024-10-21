import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import fs from "node:fs";

const PROGRAM_ID = "2MhTACCaYGrHdRShhauc6BBPNvf3y3NVUS9Ku8z5cTw6";
const SENDER_ACCOUNT = "C3r5HGAxbzsLS4WAUS9TmUeN1xkwaQLDu9EFwFpg3HpS";
const WALLET_PATH = "../my-solana-wallet.json"; // SourceAccount의 SecretKey가 필요함
const RECEIVER_ACCOUNT = "7pFUD7N2f4FHu3XDw5acqBjJ8djjqvCAGYX2ErETNVVL";

(async () => {
  // Solana Devnet에 연결
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed",
  );

  // 프로그램 ID 설정
  const programId = new PublicKey(PROGRAM_ID);
  const sourceAccount = new PublicKey(SENDER_ACCOUNT); // SOL과 데이터를 보유한 계정
  const destAccount = new PublicKey(RECEIVER_ACCOUNT); // SOL을 받을 계정

  // Source 계정의 비밀키 읽기
  const secretKeyString = fs.readFileSync(WALLET_PATH, "utf8");
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString)); // JSON 파싱 후 Uint8Array로 변환
  const sourceKeypair = Keypair.fromSecretKey(secretKey); // Source Account의 키페어 생성

  console.log(sourceKeypair);

  // 트랜잭션 인스트럭션 생성
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: sourceAccount, isSigner: true, isWritable: true }, // SourceAccount 서명 추가
      { pubkey: destAccount, isSigner: false, isWritable: true }, // 수신 계정
    ],
    programId,
    data: Buffer.alloc(0), // 프로그램에 전달할 데이터 (여기서는 빈 데이터)
  });

  // 트랜잭션 생성 및 전송
  const transaction = new Transaction().add(instruction);
  const signature = await connection.sendTransaction(transaction, [
    sourceKeypair,
  ]); // sourceAccount로 서명
  await connection.confirmTransaction(signature, "confirmed");

  console.log("Transaction confirmed with signature:", signature);
})();
