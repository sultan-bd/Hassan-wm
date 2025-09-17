// Data Table System - Realtime Firebase + UI/UX
(function(){
  'use strict';

  const DB_PATH = 'entries';
  const LOCAL_KEY = 'entries_local';
  const isFirebaseReady = !!(window.firebaseDb && window.dbRef && window.dbOnValue);
  const state = {
    items: [],
    filtered: [],
    selectedIds: new Set(),
    sort: { key: 'date', dir: 'desc' },
    page: 1,
    perPage: 10,
    pendingDelete: null,
    deletedBuffer: [],
    undoTimer: null,
    undoSeconds: 10,
    editingId: null,
    loading: true,
    digits: (localStorage.getItem('digitsLocale')||'en'),
  };

  const els = {};

  function $(id){ return document.getElementById(id); }

  let _singletonToast = null; let _toastTimer = null;
  function toast(msg, type='success'){
    const cont = $('toastContainer');
    if(!_singletonToast){
      _singletonToast = document.createElement('div');
      _singletonToast.id = 'singleton-toast';
      cont.appendChild(_singletonToast);
    }
    _singletonToast.className = `toast ${type}`;
    _singletonToast.textContent = msg;
    _singletonToast.style.display = 'flex';
    if(_toastTimer) clearTimeout(_toastTimer);
    let down = false;
    const onDown = ()=>{ down = true; };
    const onUp = ()=>{ down = false; scheduleHide(); window.removeEventListener('mouseup', onUp); window.removeEventListener('touchend', onUp); };
    window.addEventListener('mousedown', onDown, { once:true });
    window.addEventListener('touchstart', onDown, { once:true });
    window.addEventListener('mouseup', onUp, { once:true });
    window.addEventListener('touchend', onUp, { once:true });
    function scheduleHide(){ if(down) return; _toastTimer = setTimeout(()=>{ if(_singletonToast){ _singletonToast.style.display='none'; } }, 1500); }
    scheduleHide();
  }

  function loadLocal(){
    let data = [];
    try { data = JSON.parse(localStorage.getItem(LOCAL_KEY)||'[]'); } catch(e){ data=[]; }
    if(!Array.isArray(data) || data.length===0){
      const today = new Date().toISOString().slice(0,10);
      data = [
        { id: 'demo-1', number: '1001', name: 'حسن', work: 'استخراج تأشيرة', paymentType: 'کاش', sar: 150.00, date: today, category: 'income', createdAt: Date.now()-30000 },
        { id: 'demo-2', number: '1002', name: 'حسن', work: 'نقل كفالة', paymentType: 'شبكة', sar: 220.50, date: today, category: 'expense', createdAt: Date.now()-20000 },
        { id: 'demo-3', number: '1003', name: 'حسن', work: 'تجديد إقامة', paymentType: 'تحویل', sar: 85.75, date: today, category: 'income', createdAt: Date.now()-10000 }
      ];
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    }
    const cat = (window.DATA_CATEGORY||'').trim();
    state.items = cat ? data.filter(x=>x.category===cat) : data.slice();
    state.loading = false;
    state.selectedIds.clear();
    applyFilters();
  }
  function saveLocal(items){ localStorage.setItem(LOCAL_KEY, JSON.stringify(items)); }

  function formatAmount(v){
    const num = parseFloat(v||0);
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  }

  function matchFilters(item){
    const q = els.searchInput.value.trim().toLowerCase();
    const text = [item.number, item.name, item.work, item.paymentType, item.sar, item.date, item.category]
      .map(x => (x==null?'':String(x))).join(' ').toLowerCase();
    if(q && !text.includes(q)) return false;
    return true;
  }

  function applyFilters(){
    state.filtered = state.items.filter(matchFilters);
    applySort();
  }

  function applySort(){
    const { key, dir } = state.sort;
    state.filtered.sort((a,b)=>{
      let va = a[key], vb = b[key];
      if(key==='sar') { va=parseFloat(va||0); vb=parseFloat(vb||0); }
      if(key==='date'){ va=new Date(a.date).getTime(); vb=new Date(b.date).getTime(); }
      if(va<vb) return dir==='asc'?-1:1;
      if(va>vb) return dir==='asc'?1:-1;
      return 0;
    });
    renderTable();
  }

  function paginate(arr){
    const start = (state.page-1)*state.perPage;
    return arr.slice(start, start + state.perPage);
  }

  function renderPagination(){
    const total = state.filtered.length;
    const pages = Math.max(1, Math.ceil(total/state.perPage));
    const p = $('pagination');
    p.innerHTML = '';

    const prev = document.createElement('button');
    prev.className='btn secondary prev-btn';
    prev.textContent='السابق';
    prev.disabled = state.page<=1;
    prev.style.visibility = state.page<=1 ? 'hidden' : 'visible';
    prev.onclick=()=>{ prev.classList.add('is-pressed'); setTimeout(()=>prev.classList.remove('is-pressed'), 300); state.page=Math.max(1,state.page-1); renderTable(); };

    const info = document.createElement('span');
    info.className = 'page-info';
    info.textContent = `الصفحة ${state.page.toLocaleString('ar-SA')} من ${pages.toLocaleString('ar-SA')}`;

    const next = document.createElement('button');
    next.className='btn secondary next-btn';
    next.textContent='التالي';
    next.disabled = state.page>=pages;
    next.style.visibility = state.page>=pages ? 'hidden' : 'visible';
    next.onclick=()=>{ next.classList.add('is-pressed'); setTimeout(()=>next.classList.remove('is-pressed'), 300); state.page=Math.min(pages,state.page+1); renderTable(); };

    p.append(prev, info, next);
    p.tabIndex = 0;
    p.setAttribute('role','navigation');
    p.setAttribute('aria-label','التنقل بين الصفحات');
    p.onkeydown = (e)=>{
      if(e.key==='ArrowLeft'){ if(!next.disabled){ next.click(); } }
      if(e.key==='ArrowRight'){ if(!prev.disabled){ prev.click(); } }
    };
  }

  function rowTemplate(it){
    const checked = state.selectedIds.has(it.id)?'checked':'';
    const cat = (window.DATA_CATEGORY||'').trim();
    
    if (cat === 'expense') {
      // Hassan.html format: رقم، اسم، ريال، تاريخ
      return `<tr data-id="${it.id}">
        <td><input type="checkbox" class="row-check" ${checked} /></td>
        <td>${it.number||''}</td>
        <td>${it.name||''}</td>
        <td class="badge-money">${formatAmount(it.sar)}</td>
        <td>${it.date||''}</td>
        <td class="actions">
          <button class="icon-btn btn-edit" title="تعديل"><svg class="icon" viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg></button>
          <button class="icon-btn btn-delete" title="حذف"><svg class="icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg></button>
        </td>
      </tr>`;
    } else {
      // Index.html format: رقم، اسم، عمل، نوع الدفع، ريال، تاريخ
      return `<tr data-id="${it.id}">
        <td><input type="checkbox" class="row-check" ${checked} /></td>
        <td>${it.number||''}</td>
        <td>${it.name||''}</td>
        <td>${it.work||''}</td>
        <td>${it.paymentType||''}</td>
        <td class="badge-money">${formatAmount(it.sar)}</td>
        <td>${it.date||''}</td>
        <td class="actions">
          <button class="icon-btn btn-edit" title="تعديل"><svg class="icon" viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg></button>
          <button class="icon-btn btn-delete" title="حذف"><svg class="icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg></button>
        </td>
      </tr>`;
    }
  }

  function renderTable(){
    const body = $('tableBody');
    const view = paginate(state.filtered);
    if(!view.length){
      const cat = (window.DATA_CATEGORY||'').trim();
      const colspan = cat === 'expense' ? '6' : '8';
      body.innerHTML = `<tr><td colspan="${colspan}"><div class="empty-state" role="status" aria-live="polite">لا توجد بيانات لعرضها</div></td></tr>`;
    } else {
      body.innerHTML = view.map(rowTemplate).join('');
    }
    renderPagination();
    $('selectAll').checked = view.length>0 && view.every(it=>state.selectedIds.has(it.id));
  }

  function wireTableEvents(){
    $('dataTable').addEventListener('change', (e)=>{
      if(e.target.matches('#selectAll')){
        const view = paginate(state.filtered);
        if(e.target.checked){ view.forEach(it=>state.selectedIds.add(it.id)); }
        else { view.forEach(it=>state.selectedIds.delete(it.id)); }
        renderTable();
      }
      if(e.target.matches('.row-check')){
        const tr = e.target.closest('tr');
        const id = tr.getAttribute('data-id');
        if(e.target.checked) state.selectedIds.add(id); else state.selectedIds.delete(id);
      }
    });

    $('dataTable').addEventListener('click', (e)=>{
      const tr = e.target.closest('tr');
      if(!tr) return;
      const id = tr.getAttribute('data-id');
      if(e.target.closest('.btn-edit')) openEdit(id);
      if(e.target.closest('.btn-delete')) openDelete([id]);
    });

    Array.from(document.querySelectorAll('[data-sort]')).forEach(th=>{
      th.addEventListener('click', ()=>{
        const key = th.getAttribute('data-sort');
        if(state.sort.key===key){ state.sort.dir = state.sort.dir==='asc'?'desc':'asc'; }
        else { state.sort.key=key; state.sort.dir='asc'; }
        applySort();
      });
    });
  }

  function toggleBodyBlur(flag){ document.body.classList.toggle('modal-open', !!flag); }
  function confirmModal(show){ $('confirmModal').classList.toggle('show', !!show); toggleBodyBlur(show); }
  function editModal(show){ $('editModal').classList.toggle('show', !!show); toggleBodyBlur(show); }

  function openDelete(ids){ state.pendingDelete = ids; confirmModal(true); }

  function doDelete(ids){
    const toDelete = state.items.filter(x=>ids.includes(x.id));
    if(!toDelete.length){ confirmModal(false); return; }
    if(isFirebaseReady){
      Promise.all(toDelete.map(rec=> window.dbRemove(window.dbRef(window.firebaseDb, `${DB_PATH}/${rec.id}`)) ))
        .then(()=>{
          toDelete.forEach(rec=> mirrorSheetsDelete(rec));
          state.deletedBuffer = toDelete;
          startUndoCountdown();
          toast('تم حذف العناصر مؤقتاً','success');
        })
        .catch(()=> toast('فشل الحذف','error'))
        .finally(()=> confirmModal(false));
    } else {
      const remain = state.items.filter(x=>!ids.includes(x.id));
      saveLocal(remain);
      state.items = remain;
      state.deletedBuffer = toDelete;
      startUndoCountdown();
      toast('تم حذف العناص�� مؤقتاً','success');
      confirmModal(false);
      applyFilters();
    }
  }

  function startUndoCountdown(){
    clearInterval(state.undoTimer);
    state.undoSeconds = 10;
    $('undoTimer').textContent = String(state.undoSeconds);
    $('undoBar').classList.add('show');
    state.undoTimer = setInterval(()=>{
      state.undoSeconds -= 1;
      $('undoTimer').textContent = String(state.undoSeconds);
      if(state.undoSeconds<=0){
        clearInterval(state.undoTimer);
        $('undoBar').classList.remove('show');
        state.deletedBuffer = [];
      }
    }, 1000);
  }

  function undoDelete(){
    const batch = state.deletedBuffer.slice();
    if(!batch.length) return;
    if(isFirebaseReady){
      Promise.all(batch.map(rec=> {
        const { id, ...data } = rec;
        return window.dbSet(window.dbRef(window.firebaseDb, `${DB_PATH}/${id}`), data);
      })).then(()=>{
        $('undoBar').classList.remove('show');
        state.deletedBuffer = [];
        toast('تم الاسترجاع','success');
      }).catch(()=> toast('فشل الاسترجاع','error'));
    } else {
      const map = new Map(state.items.map(i=>[i.id,i]));
      batch.forEach(rec=>{ map.set(rec.id, rec); });
      const merged = Array.from(map.values());
      saveLocal(merged);
      state.items = merged;
      $('undoBar').classList.remove('show');
      state.deletedBuffer = [];
      toast('تم الاسترجاع','success');
      applyFilters();
    }
  }

  function openEdit(id){
    state.editingId = id;
    const it = state.items.find(x=>x.id===id);
    if(!it) return;
    $('editNumber').value = it.number||'';
    $('editName').value = it.name||'';
    $('editSar').value = it.sar||'';
    $('editDate').value = it.date||'';
    
    // Only set work and payment type for income category
    const cat = (window.DATA_CATEGORY||'').trim();
    if (cat !== 'expense') {
      const workField = $('editWork');
      const paymentField = $('editPaymentType');
      if (workField) workField.value = it.work||'';
      if (paymentField) paymentField.value = it.paymentType||'';
    }
    
    editModal(true);
  }

  function saveEdit(e){
    e.preventDefault();
    const id = state.editingId; if(!id) return;
    
    const baseData = {
      number: $('editNumber').value.trim(),
      name: $('editName').value.trim(),
      sar: parseFloat($('editSar').value||0),
      date: $('editDate').value,
      updatedAt: Date.now(),
    };
    
    // Add work and payment type only for income category
    const cat = (window.DATA_CATEGORY||'').trim();
    if (cat !== 'expense') {
      const workField = $('editWork');
      const paymentField = $('editPaymentType');
      if (workField) baseData.work = workField.value.trim();
      if (paymentField) baseData.paymentType = paymentField.value.trim();
    }
    
    // Set category based on current page
    baseData.category = cat || 'income';
    
    const data = baseData;
    if(!data.name){ toast('الاسم مطلوب','error'); return; }
    if(isNaN(data.sar)){ toast('المبلغ غير صا��ح','error'); return; }

    if(isFirebaseReady){
      window.dbUpdate(window.dbRef(window.firebaseDb, `${DB_PATH}/${id}`), data)
        .then(()=> { mirrorSheetsUpdate({ id, ...data }); toast('تم الحفظ','success'); editModal(false); })
        .catch(()=> toast('فشل الحفظ','error'));
    } else {
      const idx = state.items.findIndex(x=>x.id===id);
      if(idx>-1){ state.items[idx] = { ...state.items[idx], ...data }; saveLocal(state.items); }
      toast('تم الحفظ','success'); editModal(false); applyFilters();
    }
  }

  function getDateHeaders(){
    const now = new Date();
    const en = now.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
    const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day:'2-digit', month:'long', year:'numeric' }).format(now);
    return { en, hijri };
  }
  function printRows(rows){
    const d = getDateHeaders();
    const wnd = window.open('', '_blank');
    const html = `<html lang='ar' dir='rtl'><head><title>طباعة</title>
      <meta charset='UTF-8'/>
      <link href=\"https://fonts.googleapis.com/css2?family=Rubik:wght@400;600&family=Alexandria:wght@500;700&display=swap\" rel=\"stylesheet\" />
      <style>
        body{font-family: Rubik, Alexandria, sans-serif; padding:20px; background:#fff; color:#000}
        .sheet{border:1px solid #000; border-radius:12px; overflow:hidden}
        .sheet-header{background:#fff; color:#000; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #000}
        .dates{display:flex; flex-direction:column; gap:4px; text-align:left}
        .sheet-title{margin:0; font-weight:700}
        .sheet-body{padding:10px 14px;}
        table{width:100%; border-collapse:collapse}
        th,td{padding:10px; text-align:center; vertical-align:middle; border:1px solid #000}
        thead th{background:#fff; color:#000; font-weight:700}
      </style>
    </head><body>
      <div class='sheet'>
        <div class='sheet-header'><h3 class='sheet-title'>البيانات</h3><div class='dates'><span>${d.en}</span><span>${d.hijri}</span></div></div>
        <div class='sheet-body'>
          <table><thead><tr>
            <th>الرقم</th><th>الاسم</th><th>العمل</th><th>طريقة الدفع</th><th>المبلغ</th><th>التاريخ</th><th>الفئة</th>
          </tr></thead><tbody>
          ${rows.map(r=>`<tr><td>${r.number||''}</td><td>${r.name||''}</td><td>${r.work||''}</td><td>${r.paymentType||''}</td><td>${formatAmount(r.sar)}</td><td>${r.date||''}</td><td>${r.category||''}</td></tr>`).join('')}
          </tbody></table>
        </div>
      </div>
      <script>window.onload=()=>{window.print(); setTimeout(()=>window.close(), 300);}<\/script>
    </body></html>`;
    wnd.document.write(html); wnd.document.close();
  }

  async function toPdf(rows, filename='data.pdf'){
    const now = new Date();
    const en = now.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
    const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day:'2-digit', month:'long', year:'numeric' }).format(now);
    const container = document.createElement('div');
    container.setAttribute('dir','rtl');
    container.style.position='fixed'; container.style.left='-99999px'; container.style.top='0';
    
    const cat = (window.DATA_CATEGORY||'').trim();
    const headers = cat === 'expense' 
      ? '<th class="pdf-th">الرقم</th><th class="pdf-th">الاسم</th><th class="pdf-th">المبلغ</th><th class="pdf-th">التاريخ</th>'
      : '<th class="pdf-th">الرقم</th><th class="pdf-th">الاسم</th><th class="pdf-th">العمل</th><th class="pdf-th">طريقة الدفع</th><th class="pdf-th">المبلغ</th><th class="pdf-th">التاريخ</th>';
    
    const rowData = cat === 'expense'
      ? rows.map(r=>`<tr><td class="pdf-td">${r.number||''}</td><td class="pdf-td">${r.name||''}</td><td class="pdf-td">${formatAmount(r.sar)}</td><td class="pdf-td">${r.date||''}</td></tr>`).join('')
      : rows.map(r=>`<tr><td class="pdf-td">${r.number||''}</td><td class="pdf-td">${r.name||''}</td><td class="pdf-td">${r.work||''}</td><td class="pdf-td">${r.paymentType||''}</td><td class="pdf-td">${formatAmount(r.sar)}</td><td class="pdf-td">${r.date||''}</td></tr>`).join('');
    
    container.innerHTML = `
      <style>
        .pdf-wrap{ font-family: Rubik, Alexandria, sans-serif; padding:16px; width:794px; color:#000; }
        .pdf-card{ border:1px solid #000; border-radius:12px; overflow:hidden; }
        .pdf-header{ background:#fff; color:#000; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #000 }
        .pdf-title{ margin:0; font-weight:700; }
        .pdf-dates{ display:flex; flex-direction:column; gap:4px; text-align:left }
        .pdf-body{ padding:10px 14px; }
        .pdf-table{ width:100%; border-collapse:collapse; }
        .pdf-th,.pdf-td{ border:1px solid #000; padding:10px; text-align:center; vertical-align:middle; }
        .pdf-thead .pdf-th{ background:#fff; color:#000; font-weight:700; }
      </style>
      <div class=\"pdf-wrap\">
        <div class=\"pdf-card\">
          <div class=\"pdf-header\"><h3 class=\"pdf-title\">البيانات</h3><div class=\"pdf-dates\"><span>${en}</span><span>${hijri}</span></div></div>
          <div class=\"pdf-body\">
            <table class=\"pdf-table\">
              <thead class=\"pdf-thead\">
                <tr>
                  ${headers}
                </tr>
              </thead>
              <tbody class=\"pdf-tbody\">
                ${rowData}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
    document.body.appendChild(container);
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    document.body.removeChild(container);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new window.jspdf.jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const pageWidth = 595.28; const margin = 40; const imgWidth = pageWidth - margin*2;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    if(imgHeight + margin*2 <= 841.89){
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    } else {
      let sY = 0;
      const pageHeightPt = 841.89 - margin*2;
      const pageHeightPx = pageHeightPt * canvas.height / imgWidth;
      let page = 0;
      while(sY < canvas.height){
        const sliceHeight = Math.min(pageHeightPx, canvas.height - sY);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width; pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, sY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
        const pageImg = pageCanvas.toDataURL('image/png');
        if(page>0) pdf.addPage();
        pdf.addImage(pageImg, 'PNG', margin, margin, imgWidth, sliceHeight * imgWidth / canvas.width);
        sY += sliceHeight; page++;
      }
    }
    pdf.save(filename);
  }

  function getSelectedRows(){ return state.items.filter(x=>state.selectedIds.has(x.id)); }

  function mirrorSheetsUpdate(data){
    if(window.GS_SYNC_URL_UPDATE){
      fetch(window.GS_SYNC_URL_UPDATE, { method:'POST', body: JSON.stringify({ action:'update', record: data })}).catch(()=>{});
    }
  }
  function mirrorSheetsDelete(data){
    if(window.GS_SYNC_URL_DELETE){
      fetch(window.GS_SYNC_URL_DELETE, { method:'POST', body: JSON.stringify({ action:'delete', record: data })}).catch(()=>{});
    }
  }

  function addDemo(){
    const now = new Date();
    const rec = {
      number: String(Math.floor(Math.random()*9000+1000)),
      name: 'حسن',
      work: 'عمل تجريبي',
      paymentType: 'کاش',
      sar: Number((Math.random()*500).toFixed(2)),
      date: now.toISOString().slice(0,10),
      category: Math.random()>0.5?'income':'expense',
      createdAt: Date.now(),
    };
    if(isFirebaseReady){
      const key = window.dbPush(window.dbRef(window.firebaseDb, DB_PATH));
      window.dbSet(key, rec).then(()=> toast('تمت الإضافة','success')).catch(()=> toast('فشل الإضافة','error'));
    } else {
      const id = `local-${Date.now()}`;
      const row = { id, ...rec };
      const next = state.items.concat(row);
      saveLocal(next);
      state.items = next;
      toast('تمت الإضافة','success');
      applyFilters();
    }
  }

  function bindToolbar(){
    els.searchInput.oninput = ()=>{ state.page=1; applyFilters(); };

    const dl = $('digitsLocale');
    if(dl){
      dl.value = state.digits;
      dl.onchange = ()=>{ state.digits = dl.value; localStorage.setItem('digitsLocale', state.digits); renderTable(); };
    }

    const ps = $('perPageSelect');
    if(ps){
      ps.value = String(state.perPage);
      ps.onchange = ()=>{ state.perPage = parseInt(ps.value||'10',10); state.page=1; renderTable(); };
    }

    $('btn-delete-selected').onclick = ()=>{
      const rows = getSelectedRows(); if(!rows.length){ toast('لم يتم اختيار عناصر','error'); return; }
      openDelete(rows.map(r=>r.id));
    };
    $('btnConfirmDelete').onclick = ()=>{ if(state.pendingDelete) doDelete(state.pendingDelete); };
    $('btnCancelDelete').onclick = ()=> confirmModal(false);
    $('confirmClose').onclick = ()=> confirmModal(false);

    $('undoBtn').onclick = undoDelete;

    $('btn-print-selected').onclick = ()=>{ const rows = getSelectedRows(); if(!rows.length){ toast('لا بيانات','error'); return; } printRows(rows); };
    $('btn-print-all').onclick = ()=>{ printRows(state.filtered.length?state.filtered:state.items); };
    $('btn-pdf-selected').onclick = ()=>{ const rows = getSelectedRows(); if(!rows.length){ toast('لا بيانات','error'); return; } toPdf(rows, 'selected.pdf'); };
    $('btn-pdf-all').onclick = ()=>{ const rows = state.filtered.length?state.filtered:state.items; toPdf(rows, 'all-data.pdf'); };


    $('editForm').addEventListener('submit', saveEdit);
    $('btnCancelEdit').onclick = ()=> editModal(false);
    $('editClose').onclick = ()=> editModal(false);
  }

  function listenRealtime(){
    if(isFirebaseReady){
      const r = window.dbRef(window.firebaseDb, DB_PATH);
      window.dbOnValue(r, (snap)=>{
        const val = snap.val()||{};
        let rows = Object.keys(val).map(k=> ({ id:k, ...val[k] }) );
        const cat = (window.DATA_CATEGORY||'').trim();
        if(cat) rows = rows.filter(x=>x.category===cat);
        state.items = rows;
        state.loading = false;
        state.selectedIds.clear();
        applyFilters();
      });
    } else {
      loadLocal();
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    // Ensure legacy desktop-view override is cleared
    try { localStorage.removeItem('forceDesktopView'); document.body.classList.remove('force-desktop'); } catch(e){}

    els.searchInput = $('searchInput');

    bindToolbar();
    wireTableEvents();
    listenRealtime();
  });
})();
