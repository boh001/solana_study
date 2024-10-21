import { PublicKey } from '@solana/web3.js';

const PROGRAM_ID = "DE2XKCromvaC31UGrTgqh9RLY97jpH4528WBjiQR9L8"

async function createPDA() {
  // 프로그램 ID와 시드 값 설정
  const programId = new PublicKey(PROGRAM_ID);
  const seed = Buffer.from('escrow'); // PDA 생성을 위한 시드 값
  
  // PDA와 bump seed 생성
  const [pda, bumpSeed] = await PublicKey.findProgramAddress(
    [seed],
    programId
  );

  console.log('PDA Address:', pda.toBase58());
  console.log('Bump Seed:', bumpSeed);
}

createPDA();
