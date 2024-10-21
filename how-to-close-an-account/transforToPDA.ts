import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js';
import fs from 'node:fs';

const PROGRAM_ID = "2MhTACCaYGrHdRShhauc6BBPNvf3y3NVUS9Ku8z5cTw6"
const WALLET_PATH = "../my-solana-wallet.json"

async function transferToPDA() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  // 프로그램 ID와 지갑 설정
  const programId = new PublicKey(PROGRAM_ID);
  const seed = Buffer.from('escrow');
  
  // PDA 생성
  const [pda, bumpSeed] = await PublicKey.findProgramAddress([seed], programId);

  const secretKeyString = fs.readFileSync(WALLET_PATH, 'utf8');
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));  // JSON 파싱 후 Uint8Array로 변환

  // 비밀 키로부터 Keypair 생성
  const payer = Keypair.fromSecretKey(secretKey);
  const lamports = 2 * LAMPORTS_PER_SOL; // 1 SOL
  
  // 트랜잭션 생성
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey, // 송금자
      toPubkey: pda, // PDA에 송금
      lamports,
    })
  );

  // 트랜잭션 서명 및 전송
  const signature = await connection.sendTransaction(transaction, [payer]);
  await connection.confirmTransaction(signature, 'confirmed');

  console.log('Transaction confirmed with signature:', signature);
}

transferToPDA();
