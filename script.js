/* ===========================
   NAVBAR — scrolled class
   =========================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===========================
   SCROLL REVEAL
   =========================== */
const revealTargets = [
  ...document.querySelectorAll('.about-inner > *'),
  ...document.querySelectorAll('.items-header'),
  ...document.querySelectorAll('.item-row'),
  ...document.querySelectorAll('.meta-block'),
];
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => observer.observe(el));

document.querySelectorAll('.item-row').forEach((row, i) => {
  row.style.transitionDelay = `${i * 0.04}s`;
});

/* ===========================
   ACTIVE NAV LINK on scroll
   =========================== */
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ===========================
   ITEM ROW HOVER
   =========================== */
document.querySelectorAll('.item-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    const numCell = row.querySelector('.col-num');
    if (numCell) numCell.style.color = 'var(--accent-warm)';
  });
  row.addEventListener('mouseleave', () => {
    const numCell = row.querySelector('.col-num');
    if (numCell) numCell.style.color = 'var(--accent)';
  });
});

/* ===========================
   METADATA ALIGNMENT FILTER
   =========================== */
document.querySelectorAll('.align-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    const table  = document.querySelector('.align-table');
    if (!table) return;
    table.querySelectorAll('tr[data-cat]').forEach(row => {
      row.style.display = (filter === 'all' || row.dataset.cat === filter) ? '' : 'none';
    });
    table.querySelectorAll('tr[data-group]').forEach(row => {
      row.style.display = (filter === 'all' || row.dataset.group === filter) ? '' : 'none';
    });
  });
});

/* ===========================
   GRAPH SWITCHER TABS
   =========================== */
document.querySelectorAll('.graph-switcher').forEach(switcher => {
  switcher.querySelectorAll('.graph-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switcher.querySelectorAll('.graph-tab').forEach(t => t.classList.remove('active'));
      switcher.querySelectorAll('.graph-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
});

const entityBtns = document.querySelectorAll('.entity-btn');
if (entityBtns.length) {
  // Show first by default
  const firstUri = entityBtns[0].dataset.entity;
  document.getElementById('rdf-' + firstUri).style.display = '';
  entityBtns[0].classList.add('active');

  entityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      entityBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.rdf-table-wrap').forEach(t => t.style.display = 'none');
      btn.classList.add('active');
      document.getElementById('rdf-' + btn.dataset.entity).style.display = '';
    });
  });
}

/* ===========================
   RDF CODE BLOCK — load & highlight
   =========================== */
const rdfBlock = document.getElementById('rdf-code-block');
if (rdfBlock) {
  fetch('rdf.ttl')
    .then(r => r.text())
    .then(text => {
      const lines = text.split('\n').map(line => {
        // Escape HTML first
        let l = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

        // Section headers
        if (/^# [A-Z]/.test(l))
          return `<span class="ttl-section">${l}</span>`;

        // Process in safe order using placeholders to avoid re-matching

        // 1. Inline comments (save first so # in URIs/strings aren't touched)
        const commentMatch = l.match(/(^|\s)(#[^"]*)$/);
        let commentSuffix = '';
        if (commentMatch) {
          const idx = l.lastIndexOf(commentMatch[2]);
          commentSuffix = `<span class="ttl-comment">${l.slice(idx)}</span>`;
          l = l.slice(0, idx);
        }

        // 2. @prefix / @base
        l = l.replace(/^(@prefix|@base)\b/, '<span class="ttl-prefix">$1</span>');

        // 3. URIs &lt;...&gt;
        l = l.replace(/(&lt;[^&\s]*&gt;)/g, '<span class="ttl-uri">$1</span>');

        // 4. String literals (before predicate matching)
        l = l.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="ttl-lit">$1</span>');

        // 5. Predicates — only outside existing spans (match word-boundary prefixed terms)
        l = l.replace(/(?<![=\-\w/])((crm|schema|dcterms|owl|rdf|bibo|aio):[^\s;,.<]+)/g,
          '<span class="ttl-pred">$1</span>');
        // standalone 'a' as rdf:type shorthand
        l = l.replace(/(^|\s)(a)(\s)/g, '$1<span class="ttl-pred">$2</span>$3');

        // 6. Punctuation
        l = l.replace(/([;.])/g, '<span class="ttl-punct">$1</span>');

        return l + commentSuffix;
      });
      rdfBlock.innerHTML = lines.join('\n');
    })
    .catch(() => { rdfBlock.textContent = 'Could not load rdf.ttl — open the raw file directly.'; });
}

/* ===========================
   TEI XML BLOCK — load & highlight
   =========================== */
const teiBlock = document.getElementById('tei-code-block');

if (teiBlock) {
  fetch('tei/tei.xml')
    .then(r => r.text())
    .then(text => {

      // Escape HTML first
      let xml = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // XML comments
      xml = xml.replace(
        /(&lt;!--[\s\S]*?--&gt;)/g,
        '<span class="xml-comment">$1</span>'
      );

      // XML tags
      xml = xml.replace(
        /(&lt;\/?)([\w:-]+)(.*?&gt;)/g,
        '$1<span class="xml-tag">$2</span>$3'
      );

      // Attributes
      xml = xml.replace(
        /([\w:-]+)=(".*?")/g,
        '<span class="xml-attr">$1</span>=<span class="xml-string">$2</span>'
      );

      teiBlock.innerHTML = xml;
    })
    .catch(() => {
      teiBlock.textContent =
        'Could not load tei.xml — open the raw file directly.';
    });
}
