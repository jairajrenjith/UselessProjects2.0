const chatList=document.getElementById('chatList')
const messages=document.getElementById('messages')
const composer=document.getElementById('composer')
const userInput=document.getElementById('userInput')
const chatTitle=document.getElementById('chatTitle')
const chatStatus=document.getElementById('chatStatus')
const newChatBtn=document.getElementById('newChatBtn')
const clearChatBtn=document.getElementById('clearChatBtn')

let chats=[]
let activeChatId=null

function createChat(){
  const id=Date.now().toString()
  chats.push({id,history:[]})
  renderChatList()
  setActiveChat(id)
}

function deleteChat(id){
  chats = chats.filter(c => c.id !== id)
  if(activeChatId === id){
    if(chats.length > 0){
      setActiveChat(chats[0].id)
    } else {
      activeChatId = null
      messages.innerHTML = ''
      chatTitle.textContent = ''
      chatStatus.textContent = ''
    }
  }
  renderChatList()
}

function renderChatList(){
  chatList.innerHTML=''
  chats.forEach(c=>{
    const div=document.createElement('div')
    div.className='chat-item'+(c.id===activeChatId?' active':'')
    
    const name=document.createElement('span')
    name.textContent='Chat '+c.id.slice(-4)
    name.onclick=()=>setActiveChat(c.id)
    
    const delBtn=document.createElement('button')
    delBtn.className='delete-btn'
    delBtn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M3 6h18v2H3V6zm2 3h14l-1.5 12.5a1 1 0 0 1-1 .5H8a1 1 0 0 1-1-.5L5 9zm5 2v8h2v-8h-2zm4 0v8h2v-8h-2z"/>
    </svg>`
    delBtn.onclick=(e)=>{
      e.stopPropagation()
      deleteChat(c.id)
    }
    
    div.appendChild(name)
    div.appendChild(delBtn)
    chatList.appendChild(div)
  })
}

function setActiveChat(id){
  activeChatId=id
  renderChatList()
  renderMessages()
  chatTitle.textContent='Chat '+id.slice(-4)
  chatStatus.textContent='online'
}

function renderMessages(){
  messages.innerHTML=''
  const chat=chats.find(c=>c.id===activeChatId)
  chat.history.forEach((m,i)=>{
    if(m.from === 'user'){
      const wrapper=document.createElement('div')
      wrapper.className='msg-wrapper'
      const msg=document.createElement('div')
      msg.className='msg user'
      msg.textContent=m.text
      wrapper.appendChild(msg)
      if(i === chat.history.length-1){
        const seenDiv=document.createElement('div')
        seenDiv.className='seen'
        seenDiv.textContent='seen just now'
        wrapper.appendChild(seenDiv)
      }
      messages.appendChild(wrapper)
    } else {
      const msg=document.createElement('div')
      msg.className='msg bot'
      msg.textContent=m.text
      messages.appendChild(msg)
    }
  })
}

function addMessage(text,from){
  const chat=chats.find(c=>c.id===activeChatId)
  chat.history.push({text,from})
  renderMessages()
}

function botReply(){
  setTimeout(()=>{
    const typingDiv=document.createElement('div')
    typingDiv.className='typing'
    typingDiv.textContent='typing...'
    messages.appendChild(typingDiv)
    messages.scrollTop=messages.scrollHeight
    setTimeout(()=>{
      typingDiv.remove()
      const char=getRandomChar()
      addMessage(char,'bot')
    },1500)
  },1000)
}

function getRandomChar(){
  const chars=
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
    "abcdefghijklmnopqrstuvwxyz"+
    "0123456789"+
    "`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?";
  return chars.charAt(Math.floor(Math.random()*chars.length))
}

composer.onsubmit=e=>{
  e.preventDefault()
  const text=userInput.value.trim()
  if(!text)return
  addMessage(text,'user')
  userInput.value=''
  setTimeout(botReply,500)
}

newChatBtn.onclick=createChat
clearChatBtn.onclick=()=>{
  const chat=chats.find(c=>c.id===activeChatId)
  if(chat){
    chat.history=[]
    renderMessages()
  }
}

createChat()
