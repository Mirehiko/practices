const banner_data = [
  {
    title: 'vk',
    text: 'Подпишитесь на нас ВКонтакте и делитесь мнениями в комментариях',
    group_link: 'http://vk.com/pageid',
    icon: '<i class="fab fa-vk"></i>',
    ticon: '',
    views: localStorage.getItem( 'vkontakte' ) || ''
  },
  {
    title: 'fb',
    text: 'Читайте нас в Facebook. Не пропустите главное!',
    group_link: 'http://www.facebook.com/pages/pageid',
    icon: '<i class="fab fa-facebook-f"></i>',
    views: localStorage.getItem( 'facebook' ) || ''
  },
  {
    title: 'inst',
    text: 'Ещё больше ярких кадров в нашем Instagram. Подпишитесь!',
    group_link: 'https://www.instagram.com/pageid/',
    icon: '<i class="fab fa-instagram"></i>',
    ticon: '',
    views: localStorage.getItem( 'instagram' ) || ''
  },
  {
    title: 'tw',
    text: 'Подпишитесь на нас в Twitter и будьте в курсе главных тем дня',
    group_link: 'https://twitter.com/pageid',
    icon: '<i class="fab fa-twitter"></i>',
    views: localStorage.getItem( 'twitter' ) || ''
  },
  {
    title: 'tg',
    text: 'Подпишитесь на наш канал в Telegram и получайте подборки важных новостей дня',
    group_link: 'https://t.me/pageid',
    icon: '<i class="fab fa-telegram-plane"></i>',
    views: localStorage.getItem( 'telegram' ) || ''
  },
  {
    title: 'ok',
    text: 'Подпишитесь на нас в Одноклассниках. Не пропустите главное!',
    group_link: 'http://www.odnoklassniki.ru/group/pageid',
    icon: '<i class="fab fa-odnoklassniki"></i>',
    views: localStorage.getItem( 'ok' ) || ''
  },
  {
    title: 'tamtam',
    text: 'Читайте наш канал в ТамТам и получайте подборки важных новостей дня',
    group_link: 'https://tamtam.chat/pageid',
    icon: '<svg class="tamtam-logo __5thntx" viewBox="0 0 26 26"><path fill="#FFF" fill-rule="evenodd" d="M10.476 22.401l-3.263 2.201c-.331.224-.6.08-.601-.318l-.007-3.515a11.04 11.04 0 0 1-4.873-9.156C1.719 5.516 6.616.566 12.672.553c6.052-.01 10.97 4.92 10.984 11.016.012 6.096-4.887 11.046-10.94 11.058a10.89 10.89 0 0 1-2.24-.226m7.229-10.475l-10.02.02c.005 2.786 2.252 5.04 5.02 5.035 2.766-.006 5.005-2.269 5-5.055" class="__5thntx"></path></svg>',
    views: localStorage.getItem( 'tamtam' ) || ''
  }
];
function getReadUsTitle( obj, text ) {
  return `
      <div class="readus-title">
        <a href="${obj.group_link}" class="readus-title__wr ${obj.title}" target="_blank" rel="noopener" title="${obj.title}">
          <div class="readus-title__icon ${obj.title}">${obj.icon}</div>
          <div class="readus-title__text">
            <div class="readus-text">${text}</div>
          </div>
        </a>
      </div>
    `;
}
function getReadUsItem( data ) {
  return `
      <div class="readus-list__item">
        <a href="${data.group_link}" class="readus-btn ${data.title}" network=${data.title} target="_blank" rel="noopener" title="${data.title}">
          <span class="readus-btn__icon">${data.icon}</span>
        </a>
      </div>
    `;
}

function getReadUsList( data ) {
  let list = '<div class="readus-listbox"><div class="readus-list">';

  for ( let i = 0; i < data.length; i++ ) {
    list += getReadUsItem( data[ i ] );
  }

  list += '</div></div>';

  return list;
}

function initReadUs( data ) {
  let tmp = '<noindex><div class="readus-banner">';
  const social = Math.floor( Math.random() * ( data.length ) );
  tmp += getReadUsList( data );
  tmp += getReadUsTitle( data[ social ], data[ social ].text );
  tmp += '</div></noindex>';

  return tmp;
}


const read_us = initReadUs( banner_data );
$( '#readus-banner' ).append( read_us );
