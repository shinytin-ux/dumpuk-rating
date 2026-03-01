import { useState, useEffect } from "react";

const BUNDLES = [
  { id:"A01",label:"일반①",category:"adult",emoji:"✈️",name:"여행에세이",books:["나를 부르는 숲","여행의 이유","오래 준비해온 대답","유럽 도시 기행 1","유럽 도시 기행 2","제 마음대로 살아보겠습니다","지구인만큼 지구를 사랑할 순 없어"]},
  { id:"A02",label:"일반②",category:"adult",emoji:"👶",name:"육아서",books:["결국 해내는 아이는 정서 지능이 다릅니다","나는 다정한 관찰자가 되기로 했다","세상에서 가장 쉬운 본질육아","아이는 무엇으로 자라는가","어떻게 말해줘야 할까","울랄라 가족","아이라는 숲"]},
  { id:"A03",label:"일반③",category:"adult",emoji:"💬",name:"아포리즘",books:["남에게 보여주려고 인생을 낭비하지 마라","내 언어의 한계는 내 세계의 한계이다","당신의 인생이 왜 힘들지 않아야 한다고 생각하십니까","마흔에 읽는 쇼펜하우어","석가모니 인생수업","오십에 읽는 주역","나는 나를 지배하고 싶다"]},
  { id:"A04",label:"일반④",category:"adult",emoji:"📖",name:"한 책 읽기 ①",books:["각자도사 사회","나는 나답게 나이 들기로 했다","레이디 맥도날드","아주 희미한 빛으로도","연년세세","이토록 평범한 미래","아무튼, 딱따구리"]},
  { id:"A05",label:"일반⑤",category:"adult",emoji:"📚",name:"한 책 읽기 ②",books:["가재가 노래하는 곳","딸에 대하여","목소리를 드릴게요","선량한 차별주의자","아동학대에 관한 뒤늦은 기록","아직 멀었다는 말","이상한 정상가족"]},
  { id:"A06",label:"일반⑥",category:"adult",emoji:"🏆",name:"노벨문학상 수상작가",books:["단순한 열정","멜랑콜리아 I-II","샤이닝","젊은 남자","채식주의자","라스트 울프","그후의 삶"]},
  { id:"A07",label:"일반⑦",category:"adult",emoji:"🎬",name:"영화·드라마 원작소설",books:["레디 플레이어 원","미키7","죽은 시인의 사회","콘클라베","파이 이야기","향수","오늘 밤, 세계에서 이 사랑이 사라진다 해도"]},
  { id:"A08",label:"일반⑧",category:"adult",emoji:"🏃",name:"건강서",books:["30일 5분 달리기","건강 불균형 바로잡기","나는 101세, 현역 의사입니다","면역 습관","건강하게 나이 든다는 것","이기는 몸","환자 혁명"]},
  { id:"A09",label:"일반⑨",category:"adult",emoji:"🌿",name:"힐링테마 (소설 외)",books:["외로우니까 사람이다","수선화에게","모든 순간이 너였다","#너에게","지쳤거나 좋아하는 게 없거나","꽃을 보듯 너를 본다","태도에 관하여"]},
  { id:"A10",label:"일반⑩",category:"adult",emoji:"💆",name:"힐링테마 (소설)",books:["달러구트 꿈 백화점","메리골드 마음 사진관","메리골드 마음 세탁소","미드나잇 라이브러리","불편한 편의점","세상의 마지막 기차역","어서 오세요, 휴남동 서점입니다","오늘 밤, 세계에서 이 사랑이 사라진다 해도"]},
  { id:"A11",label:"일반⑪",category:"adult",emoji:"🧘",name:"마음 건강 강화",books:["감정의 이해","강인함의 힘","마음 지구력","생각 중독","생각이 너무 많은 어른들을 위한 심리학","잘하고 싶어서 자꾸만 애썼던 너에게","나라는 식물을 키워보기로 했다"]},
  { id:"A12",label:"일반⑫",category:"adult",emoji:"🌧️",name:"우울할 때 읽으면 좋은 책",books:["우울할 땐 뇌과학","아무것도 안 해도 아무렇지 않구나","소란한 감정에 대처하는 자세","우울증 사용설명서","나의 우울에게","스물아홉 생일, 1년 후 죽기로 결심했다","내가 원하는 것을 나도 모를 때"]},
  { id:"A13",label:"일반⑬",category:"adult",emoji:"🔮",name:"미래·내일",books:["AI하라","어디서 살 것인가","그냥 하지 말라","빌 게이츠, 기후재앙을 피하는 법","일어날 일은 일어난다","지속 불가능 자본주의","편리한 진실"]},
  { id:"A14",label:"일반⑭",category:"adult",emoji:"💰",name:"재테크 베스트",books:["바빌론의 부자 멘토와 꼬마 제자","대한민국 돈의 역사","부의 시나리오","살 때 팔 때 벌 때","투자의 본질","한국형 가치투자","더 늦기 전에 당신이 자본주의를 제대로 알면 좋겠습니다"]},
  { id:"A15",label:"일반⑮",category:"adult",emoji:"✍️",name:"말띠 작가 열전 ① (국내)",books:["오아시스 각본집","곽재구의 포구기행","영원한 천국","파일명 서정시","서영동 이야기","눈으로 만든 사람","죽고 싶지만 떡볶이는 먹고 싶어"]},
  { id:"A16",label:"일반⑯",category:"adult",emoji:"🌍",name:"말띠 작가 열전 ② (국외)",books:["남아 있는 나날","사소한 칼","예고도 없이 나이를 먹고 말았습니다","티핑 더 벨벳","편의점 인간","운명과 분노","인간들의 가장 은밀한 기억"]},
  { id:"Y01",label:"청소년①",category:"youth",emoji:"🌏",name:"해외 문학 걸작선",books:["줄무늬 파자마를 입은 소년","앵무새 죽이기","로봇 소년, 학교에 가다","나는 초콜릿의 달콤함을 모릅니다","리버보이","잘못은 우리 별에 있어","트루먼 스쿨 악플 사건","미안해, 스이카","새들이 모조리 사라진다면","기억 전달자"]},
  { id:"Y02",label:"청소년②",category:"youth",emoji:"📌",name:"한 책 읽기 선정 도서",books:["슬기로운 미디어 생활","2미터 그리고 48시간","지구를 살리는 기발한 물건 10","나는 나를 돌봅니다","구미호 식당","나는 풍요로웠고, 지구는 달라졌다","사춘기라 그런 게 아니라 우울해서 그런 거예요","호수의 일","청소년을 위한 처음 경제학","순례 주택"]},
  { id:"Y03",label:"청소년③",category:"youth",emoji:"🏅",name:"창비 청소년 문학상 수상작",books:["완득이","두려움에게 인사하는 법","비바, 천하최강","꽃 달고 살아남기","페인트","유원","싱커","클로버","아몬드","율의 시선"]},
  { id:"Y04",label:"청소년④",category:"youth",emoji:"🎖️",name:"문학동네 청소년 문학상 수상작",books:["불량 가족 레시피","흑룡전설 용지호","그치지 않는 비","창밖의 아이들","테오도루 24번지","독고솜에게 반하면","체리새우: 비밀글입니다","훌훌","고요한 우연","네임 스티커"]},
  { id:"Y05",label:"청소년⑤",category:"youth",emoji:"🇰🇷",name:"독립운동가 ①",books:["안담사리: 안규홍 의병일지","김산의 아리랑","광풍은 아침 내내 불지 않는다, 안창남","위대한 케미, 연미당","끝나지 않은 이야기, 전월선","독립운동가 단편 만화 모음집","바스락, 김하락","합작, 김규식","한글이 목숨, 최현배","위종, 이위종"]},
  { id:"Y06",label:"청소년⑥",category:"youth",emoji:"🏴",name:"독립운동가 ②",books:["송곳니, 박희광","갈림길, 남자현","작은 물결 방정환","조선 비밀결사 대동단, 전협","청산리 독립전쟁, 김좌진","Flame, 백정기","쾌남아, 유일한","기무전, 김우전","대한의 잔다르크, 지복영","푸른 노인, 강우규"]},
  { id:"Y07",label:"청소년⑦",category:"youth",emoji:"🔬",name:"청소년 교양도서 (과학·기술)",books:["시간여행을 위한 최소한의 물리학","살아 보니, 시간","퍼펙트 게스","식욕이 왜 그럴 과학","우리에게 남은 시간","최소한의 데이터 리터러시","디지털 호신술","하리하라의 과학 배틀","세상 모든 화학 이야기","미래 세대를 위한 건축과 기후 이야기"]},
  { id:"Y08",label:"청소년⑧",category:"youth",emoji:"🗺️",name:"청소년 교양도서 (인문·사회)",books:["철학자들의 토론회","나의 첫 지정학 수업","푸드 지오그래피","만화로 보는 좌충우돌 몽골제국사","국제 분쟁으로 보다, 세계사","지적 대화를 위한 교양인의 현대 철학","질문으로 시작하는 생태 감수성 수업","스포츠 인문학 수업","재밌어서 밤새 읽는 맞춤법 이야기","경제수학, 위기의 편의점을 살려라!"]},
  { id:"Y09",label:"청소년⑨",category:"youth",emoji:"🎨",name:"청소년 교양도서 (문학·예술)",books:["나는 캐나다의 한국인 응급구조사","특별한 호두","별빛 창창","고백루프","빅토피아","크리에이티브 웨이","이번 역은 요절복통 지하세계입니다","이야기 미술관","이네스는 오늘 태어날 거야","영혼을 단장해드립니다, 챠밍 미용실"]},
];

const ADMIN_PW = "6363";

const C = {
  bg:"#faf7f2",card:"#ffffff",dark:"#2c2118",
  accent:"#c17f3a",accent2:"#8b5e2a",muted:"#9b8b7a",
  border:"#e8dfd4",youth:"#4a7c5a",youthBg:"#f0f7f2",
  red:"#c0392b",redBg:"#fdf0ee",
};

const LABEL = {
  0.5:"0.5 ★ 많이 아쉬웠어요",1:"1 ★ 별로예요",1.5:"1.5 ★ 아쉬웠어요",
  2:"2 ★ 그저 그래요",2.5:"2.5 ★ 조금 아쉬웠어요",3:"3 ★ 괜찮아요",
  3.5:"3.5 ★ 꽤 좋았어요",4:"4 ★ 좋았어요",4.5:"4.5 ★ 아주 좋았어요",5:"5 ★ 최고예요!",
};

function StarIcon({ fill, size }) {
  const uid = `s${Math.random().toString(36).slice(2,7)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block",flexShrink:0}}>
      {fill==="half"&&(<defs><linearGradient id={uid} x1="0" x2="1" y1="0" y2="0">
        <stop offset="50%" stopColor="#e8a020"/><stop offset="50%" stopColor="#ddd0c0"/>
      </linearGradient></defs>)}
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={fill==="full"?"#e8a020":fill==="half"?`url(#${uid})`:"#ddd0c0"}/>
    </svg>
  );
}

function Stars({ value, size=16 }) {
  return (
    <div style={{display:"flex",gap:1}}>
      {[1,2,3,4,5].map(i=>(
        <StarIcon key={i} size={size} fill={value>=i?"full":value>=i-0.5?"half":"empty"}/>
      ))}
    </div>
  );
}

function StarInput({ value, size=36, onSelect }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  return (
    <div style={{display:"flex",gap:2}}>
      {[1,2,3,4,5].map(i=>(
        <div key={i} style={{position:"relative",width:size,height:size,cursor:"pointer"}}>
          <div style={{position:"absolute",left:0,top:0,width:"50%",height:"100%",zIndex:1}}
            onMouseEnter={()=>setHovered(i-0.5)} onMouseLeave={()=>setHovered(0)} onClick={()=>onSelect(i-0.5)}/>
          <div style={{position:"absolute",right:0,top:0,width:"50%",height:"100%",zIndex:1}}
            onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(0)} onClick={()=>onSelect(i)}/>
          <div style={{transform:display>=i-0.1&&display<=i?"scale(1.15)":"scale(1)",transition:"transform 0.1s"}}>
            <StarIcon size={size} fill={display>=i?"full":display>=i-0.5?"half":"empty"}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function getAvg(reviews) {
  if (!reviews?.length) return null;
  return (reviews.reduce((s,r)=>s+r.stars,0)/reviews.length).toFixed(1);
}

function toDay() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
}

export default function App() {
  const [allReviews, setAllReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("list");
  const [current, setCurrent] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedStar, setSelectedStar] = useState(0);
  const [nickname, setNickname] = useState("");
  const [text, setText] = useState("");
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [showBooks, setShowBooks] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminFilter, setAdminFilter] = useState("all");

  useEffect(() => { loadReviews(); }, []);

  async function loadReviews() {
    setLoading(true);
    try {
      const res = await fetch("/api/getReviews");
      const data = await res.json();
      setAllReviews(data);
    } catch {
      setAllReviews({});
    }
    setLoading(false);
  }

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(""),2500); }

  async function submitReview() {
    if (!selectedStar) { showToast("별점을 선택해주세요!"); return; }
    if (!nickname.trim()) { showToast("닉네임을 입력해주세요!"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/addReview", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ bundleId:current, stars:selectedStar, nickname:nickname.trim(), text:text.trim(), date:toDay() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // 로컬 상태에도 즉시 반영
      const newReview = { id:data.id, bundleId:current, stars:selectedStar, nickname:nickname.trim(), text:text.trim(), date:toDay() };
      setAllReviews(prev => ({ ...prev, [current]: [...(prev[current]||[]), newReview] }));
      setSelectedStar(0); setNickname(""); setText("");
      showToast("후기가 등록되었습니다 🎉");
    } catch { showToast("저장 중 오류가 발생했습니다."); }
    setSaving(false);
  }

  async function deleteReview(bundleId, reviewId) {
    if (!window.confirm("이 후기를 삭제할까요?")) return;
    try {
      const res = await fetch("/api/deleteReview", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ reviewId, password: ADMIN_PW }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setAllReviews(prev => ({ ...prev, [bundleId]: prev[bundleId].filter(r=>r.id!==reviewId) }));
      showToast("삭제되었습니다.");
    } catch { showToast("삭제 중 오류가 발생했습니다."); }
  }

  function goDetail(id) { setCurrent(id); setShowBooks(false); setPage("detail"); }
  function goList() { setCurrent(null); setSelectedStar(0); setNickname(""); setText(""); setPage("list"); }
  function goAdmin() { setPage("admin"); setAdminAuthed(false); setAdminPw(""); setAdminError(false); }
  function tryAdmin() { if(adminPw===ADMIN_PW){setAdminAuthed(true);setAdminError(false);}else setAdminError(true); }

  const bundle = BUNDLES.find(b=>b.id===current);
  const bundleReviews = current ? (allReviews[current]||[]) : [];
  const avg = bundle ? getAvg(bundleReviews) : null;
  const filtered = BUNDLES.filter(b=>filter==="all"||b.category===filter);

  const adminList = BUNDLES.flatMap(b =>
    (allReviews[b.id]||[]).map(r=>({...r,bundleId:b.id,bundleName:b.name,bundleLabel:b.label,bundleEmoji:b.emoji}))
  ).filter(r=>adminFilter==="all"||BUNDLES.find(b=>b.id===r.bundleId)?.category===adminFilter)
   .sort((a,b)=>b.id-a.id);

  if (loading) return (
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif"}}>
      <div style={{textAlign:"center",color:C.muted}}>
        <div style={{fontSize:"2.5rem",marginBottom:10}}>📦</div>
        <div>후기를 불러오는 중...</div>
      </div>
    </div>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",color:C.dark}}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet"/>

      {/* 헤더 */}
      <div style={{background:C.dark,color:"#faf7f2",padding:"22px 20px 16px",textAlign:"center",position:"relative"}}>
        <div onClick={goList} style={{fontFamily:"'Noto Serif KR',serif",fontSize:"1.45rem",letterSpacing:"0.04em",marginBottom:3,cursor:"pointer"}}>
          📦 듬뿍(Book) 꾸러미
        </div>
        <div style={{fontSize:"0.73rem",color:"#c8b99a",letterSpacing:"0.06em"}}>
          노원평생학습관 문헌정보실 · 가방째 빌려드립니다
        </div>
        <button onClick={page==="admin"?goList:goAdmin}
          style={{position:"absolute",right:14,top:16,background:"rgba(255,255,255,0.12)",border:"none",
            color:"#c8b99a",fontSize:"0.7rem",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>
          {page==="admin"?"← 돌아가기":"관리자"}
        </button>
      </div>

      <div style={{maxWidth:560,margin:"0 auto",padding:"16px 14px 60px"}}>

        {/* 관리자 */}
        {page==="admin" && (!adminAuthed ? (
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:28,textAlign:"center",marginTop:20}}>
            <div style={{fontSize:"2rem",marginBottom:10}}>🔒</div>
            <div style={{fontFamily:"'Noto Serif KR',serif",fontSize:"1rem",marginBottom:18}}>관리자 로그인</div>
            <input type="password" placeholder="비밀번호 입력" value={adminPw}
              onChange={e=>setAdminPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryAdmin()}
              style={{width:"100%",border:`1px solid ${adminError?C.red:C.border}`,borderRadius:8,
                padding:"10px 14px",fontSize:"0.9rem",fontFamily:"inherit",
                background:C.bg,color:C.dark,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
            {adminError&&<div style={{color:C.red,fontSize:"0.78rem",marginBottom:8}}>비밀번호가 올바르지 않습니다.</div>}
            <button onClick={tryAdmin}
              style={{width:"100%",background:C.dark,color:"#faf7f2",border:"none",borderRadius:8,
                padding:"11px",fontFamily:"inherit",fontSize:"0.9rem",cursor:"pointer"}}>확인</button>
          </div>
        ) : (
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <div style={{fontFamily:"'Noto Serif KR',serif",fontSize:"1rem"}}>🛠️ 관리자 — 전체 후기 ({adminList.length}건)</div>
              <div style={{display:"flex",gap:6}}>
                {[["all","전체"],["adult","일반"],["youth","청소년"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setAdminFilter(v)}
                    style={{padding:"4px 10px",borderRadius:12,border:"none",cursor:"pointer",fontSize:"0.72rem",fontFamily:"inherit",
                      background:adminFilter===v?C.dark:C.border,color:adminFilter===v?"#faf7f2":C.muted}}>{l}</button>
                ))}
              </div>
            </div>
            {adminList.length===0
              ? <div style={{textAlign:"center",padding:30,color:C.muted,fontSize:"0.85rem"}}>후기가 없습니다.</div>
              : adminList.map(r=>(
                <div key={r.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 15px",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    <span style={{fontSize:"1rem"}}>{r.bundleEmoji}</span>
                    <span style={{fontSize:"0.72rem",color:C.accent2,fontWeight:500}}>{r.bundleLabel}</span>
                    <span style={{fontSize:"0.78rem",fontWeight:600}}>{r.bundleName}</span>
                    <button onClick={()=>deleteReview(r.bundleId,r.id)}
                      style={{marginLeft:"auto",background:C.redBg,color:C.red,border:`1px solid ${C.red}`,
                        borderRadius:6,padding:"3px 10px",fontSize:"0.72rem",cursor:"pointer",fontFamily:"inherit"}}>삭제</button>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:r.text?5:0}}>
                    <Stars value={r.stars} size={13}/>
                    <span style={{fontSize:"0.73rem",color:C.accent2,fontWeight:600}}>★ {r.stars}</span>
                    <span style={{fontSize:"0.73rem",color:C.dark,fontWeight:500}}>— {r.nickname||"익명"}</span>
                    <span style={{marginLeft:"auto",fontSize:"0.68rem",color:C.muted}}>{r.date}</span>
                  </div>
                  {r.text&&<div style={{fontSize:"0.82rem",lineHeight:1.6,color:"#4a3a2c"}}>{r.text}</div>}
                </div>
              ))
            }
          </>
        ))}

        {/* 목록 */}
        {page==="list" && (
          <>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {[["all","전체 (25)"],["adult","일반 (16)"],["youth","청소년 (9)"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFilter(v)}
                  style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",
                    fontSize:"0.8rem",fontFamily:"inherit",fontWeight:500,
                    background:filter===v?C.dark:C.border,color:filter===v?"#faf7f2":C.muted,transition:"all 0.2s"}}>{l}</button>
              ))}
            </div>
            {filtered.map(b=>{
              const rs=allReviews[b.id]||[];
              const a=getAvg(rs);
              const isY=b.category==="youth";
              return (
                <div key={b.id} onClick={()=>goDetail(b.id)}
                  style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,
                    padding:"14px 16px",marginBottom:8,cursor:"pointer",
                    display:"flex",alignItems:"center",gap:12,transition:"all 0.15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=isY?C.youth:C.accent;e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,0.08)";e.currentTarget.style.transform="translateY(-1px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
                  <div style={{fontSize:"1.8rem",width:40,textAlign:"center",flexShrink:0}}>{b.emoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <span style={{fontSize:"0.65rem",padding:"1px 6px",borderRadius:8,fontWeight:500,
                        background:isY?C.youthBg:"#f5ede0",color:isY?C.youth:C.accent2,
                        border:`1px solid ${isY?"#c8e0d0":"#e8cfa0"}`}}>{b.label}</span>
                      <span style={{fontWeight:700,fontSize:"0.95rem"}}>{b.name}</span>
                    </div>
                    <div style={{fontSize:"0.72rem",color:C.muted,marginBottom:4}}>도서 {b.books.length}권</div>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      {a?(<><Stars value={parseFloat(a)} size={12}/>
                        <span style={{fontSize:"0.75rem",color:C.accent2,fontWeight:600}}>★ {a}</span>
                        <span style={{fontSize:"0.7rem",color:C.muted}}>({rs.length}명)</span></>)
                       :<span style={{fontSize:"0.72rem",color:C.muted}}>아직 후기가 없어요</span>}
                    </div>
                  </div>
                  <span style={{color:C.border,fontSize:"1.1rem"}}>›</span>
                </div>
              );
            })}
          </>
        )}

        {/* 상세 */}
        {page==="detail" && bundle && (
          <>
            <button onClick={goList}
              style={{background:"none",border:"none",color:C.accent2,fontSize:"0.85rem",
                cursor:"pointer",marginBottom:14,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4,padding:0}}>
              ← 목록으로
            </button>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"22px 18px",marginBottom:12,textAlign:"center"}}>
              <div style={{fontSize:"2.8rem",marginBottom:8}}>{bundle.emoji}</div>
              <div style={{display:"inline-block",fontSize:"0.65rem",padding:"2px 8px",borderRadius:10,
                background:bundle.category==="youth"?C.youthBg:"#f5ede0",
                color:bundle.category==="youth"?C.youth:C.accent2,
                border:`1px solid ${bundle.category==="youth"?"#c8e0d0":"#e8cfa0"}`,
                marginBottom:6,fontWeight:500}}>{bundle.label}</div>
              <div style={{fontFamily:"'Noto Serif KR',serif",fontSize:"1.25rem",fontWeight:700,marginBottom:10}}>{bundle.name}</div>
              {avg?(<>
                <div style={{fontSize:"2rem",fontWeight:700,color:C.accent,lineHeight:1,marginBottom:4}}>★ {avg}</div>
                <div style={{display:"flex",justifyContent:"center",marginBottom:4}}><Stars value={parseFloat(avg)} size={20}/></div>
                <div style={{fontSize:"0.78rem",color:C.muted}}>{bundleReviews.length}명이 평가했어요</div>
              </>):<div style={{fontSize:"0.82rem",color:C.muted}}>아직 평가가 없어요. 첫 번째가 되어주세요!</div>}
              <button onClick={()=>setShowBooks(!showBooks)}
                style={{marginTop:14,background:showBooks?C.dark:C.border,color:showBooks?"#faf7f2":C.muted,
                  border:"none",borderRadius:8,padding:"7px 16px",fontSize:"0.78rem",
                  cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
                {showBooks?"▲ 도서 목록 닫기":"▼ 수록 도서 목록 보기"}
              </button>
              {showBooks&&(
                <div style={{marginTop:12,textAlign:"left"}}>
                  {bundle.books.map((book,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"6px 0",
                      borderBottom:i<bundle.books.length-1?`1px solid ${C.border}`:"none",fontSize:"0.82rem"}}>
                      <span style={{color:C.muted,flexShrink:0,minWidth:18,fontSize:"0.72rem",paddingTop:2}}>{i+1}</span>
                      <span>{book}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
              <div style={{fontFamily:"'Noto Serif KR',serif",fontSize:"0.95rem",marginBottom:14}}>✍️ 별점 남기기</div>
              <input type="text" placeholder="닉네임을 입력해주세요 (최대 10자)" maxLength={10}
                value={nickname} onChange={e=>setNickname(e.target.value)}
                style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,
                  padding:"9px 12px",fontFamily:"inherit",fontSize:"0.83rem",
                  color:C.dark,background:C.bg,outline:"none",boxSizing:"border-box",marginBottom:4}}/>
              <div style={{fontSize:"0.68rem",color:C.muted,marginBottom:12}}>실명 입력 불필요 · 예: 책읽는곰, 도서관단골</div>
              <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
                <StarInput value={selectedStar} size={40} onSelect={setSelectedStar}/>
              </div>
              {selectedStar>0&&<div style={{textAlign:"center",fontSize:"0.8rem",color:C.accent2,marginBottom:12}}>{LABEL[selectedStar]}</div>}
              <textarea rows={3} placeholder="한 줄 소감을 남겨주세요 (선택)" value={text} onChange={e=>setText(e.target.value)}
                style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,
                  padding:"10px 12px",fontFamily:"inherit",fontSize:"0.83rem",
                  color:C.dark,background:C.bg,resize:"none",outline:"none",
                  marginBottom:10,boxSizing:"border-box",lineHeight:1.6}}/>
              <button onClick={submitReview} disabled={saving}
                style={{width:"100%",background:saving?C.muted:C.dark,color:"#faf7f2",
                  border:"none",borderRadius:8,padding:"12px",fontFamily:"inherit",
                  fontSize:"0.9rem",cursor:saving?"not-allowed":"pointer",letterSpacing:"0.04em",transition:"background 0.2s"}}>
                {saving?"저장 중...":"등록하기"}
              </button>
            </div>

            <div style={{fontFamily:"'Noto Serif KR',serif",fontSize:"0.95rem",marginBottom:10}}>
              이용 후기 {bundleReviews.length>0?`(${bundleReviews.length})`:""}
            </div>
            {bundleReviews.length===0
              ?<div style={{textAlign:"center",padding:28,color:C.muted,fontSize:"0.85rem",
                  background:C.card,border:`1px solid ${C.border}`,borderRadius:12}}>📝 첫 번째 후기를 남겨주세요!</div>
              :[...bundleReviews].reverse().map((r,i)=>(
                <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 15px",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:r.text?5:0}}>
                    <Stars value={r.stars} size={13}/>
                    <span style={{fontSize:"0.73rem",color:C.accent2,fontWeight:600}}>★ {r.stars}</span>
                    <span style={{fontSize:"0.75rem",color:C.dark,fontWeight:500}}>— {r.nickname||"익명"}</span>
                    <span style={{marginLeft:"auto",fontSize:"0.68rem",color:C.muted}}>{r.date}</span>
                  </div>
                  {r.text&&<div style={{fontSize:"0.82rem",lineHeight:1.65,color:"#4a3a2c"}}>{r.text}</div>}
                </div>
              ))
            }
          </>
        )}
      </div>

      {toast&&(
        <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",
          background:C.dark,color:"#faf7f2",padding:"10px 22px",borderRadius:22,
          fontSize:"0.85rem",zIndex:999,pointerEvents:"none",whiteSpace:"nowrap",
          boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>
          {toast}
        </div>
      )}
    </div>
  );
}
