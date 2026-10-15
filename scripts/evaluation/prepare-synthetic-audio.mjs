import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
const directory = resolve('tests/fixtures/capture/generated');
mkdirSync(directory, { recursive: true });
// Quoted Polish source data is intentionally kept in its original language.
const samples = [
  ['correction', 'Dodaj dwieście gramów mąki. Przepraszam, poprawiam: dwieście pięćdziesiąt gramów mąki. Dodaj sto mililitrów mleka. Wymieszaj. Nie podaję temperatury ani czasu pieczenia.', [{name:'mąka',quantity:250,unit:'gramów'},{name:'mleko',quantity:100,unit:'mililitrów'}], null, null],
  ['temperature', 'Dodaj dwa jajka i pięćdziesiąt gramów cukru. Wymieszaj. Piecz w temperaturze stu osiemdziesięciu stopni Celsjusza przez dwadzieścia pięć minut.', [{name:'jajka',quantity:2,unit:null},{name:'cukier',quantity:50,unit:'gramów'}], 180, 25],
  ['unknown', 'Przygotuj ziemniaki i sól. Nie pamiętam ilości ziemniaków ani soli. Ugotuj ziemniaki. Nie podaję czasu gotowania.', [{name:'ziemniaki',quantity:null,unit:null},{name:'sól',quantity:null,unit:null}], null, null],
];
const fixtures = [];
for (const [id, text, ingredients, temperatureC, minutes] of samples) {
  writeFileSync(`${directory}/${id}.txt`, text+'\n');
  execFileSync('say', ['-v','Zosia','-r','145','-f',`${directory}/${id}.txt`,'-o',`${directory}/${id}.aiff`]);
  const extension = id === 'correction' ? 'wav' : id === 'temperature' ? 'm4a' : 'webm';
  const codec = extension === 'wav' ? 'pcm_s16le' : extension === 'm4a' ? 'aac' : 'libopus';
  execFileSync('ffmpeg', ['-y','-v','error','-i',`${directory}/${id}.aiff`,'-ar',extension==='webm'?'48000':'16000','-ac','1','-c:a',codec,`${directory}/${id}.${extension}`]);
  fixtures.push({ id:`synthetic-${id}`, kind:'audio',path:`generated/${id}.${extension}`,mime:`audio/${extension}`,consent:true,synthetic:true,reference:{ingredients,temperatureC,minutes,steps:['Source instructions require human comparison.'],uncertainties:[],forbiddenStepPatterns:id==='correction'?['\\b200\\b']:[]}});
}
// A repeated TTS load fixture tests duration/chunk transport only, not natural five-minute narration.
execFileSync('ffmpeg', ['-y','-v','error','-stream_loop','-1','-i',`${directory}/correction.wav`,'-t','300','-ar','16000','-ac','1','-c:a','aac',`${directory}/five-minute.m4a`]);
fixtures.push({...fixtures[0],id:'synthetic-five-minute-loop',path:'generated/five-minute.m4a',mime:'audio/mp4'});
writeFileSync('tests/fixtures/capture/manifest.json',JSON.stringify({provenance:'Agent-authored synthetic recipes, local macOS Zosia TTS. No family or personal source data. References are agent-authored and await human confirmation.',representativeAcceptance:'pending real images, natural speech and human reference review; synthetic load evidence cannot close T09',fixtures},null,2)+'\n');
