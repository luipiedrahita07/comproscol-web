
const categorias = ['Todos', ...new Set(productos.map(p => p.cat))];
let filtroActivo = 'Todos';
let productoActual = null;

// Filtros
const filtrosEl = document.getElementById('filtros');
categorias.forEach(c => {
  const btn = document.createElement('button');
  btn.className = 'filter-btn' + (c === 'Todos' ? ' active' : '');
  btn.textContent = c;
  btn.onclick = () => {
    filtroActivo = c;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGrid();
  };
  filtrosEl.appendChild(btn);
});

function renderGrid() {
  const grid = document.getElementById('grid');
  const q = document.getElementById('heroSearch').value.toLowerCase();
  const lista = productos.filter(p => {
    const enCat = filtroActivo === 'Todos' || p.cat === filtroActivo;
    const enQ = !q || p.nombre.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
    return enCat && enQ;
  });
  document.getElementById('conteo').textContent = `Mostrando ${lista.length} producto${lista.length !== 1 ? 's' : ''}`;
  grid.innerHTML = lista.map(p => `
    <div class="prod-card" onclick="abrirModal(${p.id})">
      <div class="prod-img-placeholder">${p.emoji}</div>
      <div class="prod-body">
        <div class="prod-cat">${p.cat}</div>
        <div class="prod-name">${p.nombre}</div>
        <div class="prod-desc">${p.desc}</div>
        <div class="prod-footer">
          <span class="prod-norma">${p.specs[0][1]}</span>
          <button class="prod-cta" onclick="event.stopPropagation();abrirModal(${p.id})">Ver más</button>
        </div>
      </div>
    </div>
  `).join('');
}

function buscar() { renderGrid(); }

document.getElementById('heroSearch').addEventListener('keyup', e => {
  if (e.key === 'Enter') buscar();
});

function abrirModal(id) {
  productoActual = productos.find(p => p.id === id);
  const p = productoActual;
  document.getElementById('m-img').textContent = p.emoji;
  document.getElementById('m-cat').textContent = p.cat;
  document.getElementById('m-name').textContent = p.nombre;
  document.getElementById('m-desc').textContent = p.desc;
  document.getElementById('m-specs').innerHTML = p.specs.map(([k, v]) => `
    <div class="spec-row"><span class="spec-key">${k}</span><span class="spec-val">${v}</span></div>
  `).join('');
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modal').addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) cerrarModal();
});

function abrirWA() {
  const p = productoActual;
  const msg = encodeURIComponent(`Hola, estoy interesado en el producto: *${p.nombre}* (${p.cat}). ¿Me puede dar más información?`);
  window.open(`https://wa.me/573000000000?text=${msg}`, '_blank');
}

function consultarIA() {
  cerrarModal();
  if (typeof sendPrompt === 'function') {
    sendPrompt(`Cuéntame más sobre ${productoActual.nombre}: especificaciones técnicas, normas de referencia colombianas y usos recomendados.`);
  }
}

renderGrid();
