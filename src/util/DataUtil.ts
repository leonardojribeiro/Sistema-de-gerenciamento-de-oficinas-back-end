export default function getDataAtual(){
  const dataAtual = new Date();
  dataAtual.setTime(Date.now());
  return dataAtual;
}