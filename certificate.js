(() => {
  'use strict';
  const requestedGrade = new URLSearchParams(location.search).get('grade');
  const grade = ['7', '8', '9', '10', '11'].includes(requestedGrade) ? requestedGrade : '9';
  const courseName = `${grade}-sinf fizika`;
  const physicsKey = grade === '7' ? 'idrokPhysics7' : grade === '8' ? 'idrokPhysics8' : grade === '10' ? 'idrokPhysics10' : grade === '11' ? 'idrokPhysics11' : 'idrokPhysics';
  const certificateKey = grade === '7' ? 'idrokCertificate7' : grade === '8' ? 'idrokCertificate8' : grade === '10' ? 'idrokCertificate10' : grade === '11' ? 'idrokCertificate11' : 'idrokCertificate';
  const coursePage = grade === '7' ? 'physics7.html' : grade === '8' ? 'physics8.html' : grade === '10' ? 'physics10.html' : grade === '11' ? 'physics11.html' : 'physics.html';
  const totalLessons = grade === '7' ? 62 : grade === '8' ? 60 : grade === '11' ? 45 : 59;
  const users = JSON.parse(localStorage.getItem('idrokUsers') || '[]');
  const email = localStorage.getItem('idrokCurrentUser');
  const user = users.find(item => item.email === email);
  const physics = JSON.parse(localStorage.getItem(physicsKey) || '{"completed":[]}');
  const state = JSON.parse(localStorage.getItem('idrokState') || '{"impulse":0}');
  const saved = JSON.parse(localStorage.getItem(certificateKey) || '{}');
  document.querySelector('#studentName').textContent = user?.name || 'Idrok o‘quvchisi';
  document.querySelector('#certificateCourse').textContent = courseName;
  document.querySelector('#certificateBack').href = coursePage;
  document.querySelector('#certificateImpulse').textContent = `${Number(state.impulse) || 0} ϟ`;
  document.querySelector('#certificateDate').textContent = new Intl.DateTimeFormat('uz-UZ', {day:'2-digit', month:'long', year:'numeric'}).format(new Date());
  document.querySelector('#certificateId').textContent = saved.certificateId ? `IDROK-${saved.certificateId.toUpperCase()}` : 'IDROK-LOCAL';
  const completedCount = Math.min(totalLessons, new Set(physics.completed || []).size);
  const complete = completedCount >= totalLessons;
  document.querySelector('#certificateProgress').textContent = `${completedCount} / ${totalLessons}`;
  document.querySelector('#certificateStatus').textContent = complete
    ? (saved.email?.status === 'sent' ? 'Sertifikat emailingizga ham yuborildi.' : saved.email?.status === 'not_configured' ? 'Sertifikat tayyor. Email yuborish xizmati serverda hali sozlanmagan.' : 'Sertifikat tayyor — tugma orqali PDF sifatida saqlang.')
    : `Sertifikat faqat ${totalLessons} ta mavzu tugatilgandan keyin haqiqiy hisoblanadi.`;
  if (!complete) document.querySelector('#certificate').classList.add('incomplete');
  document.querySelector('#printCertificate').addEventListener('click', () => window.print());
})();
