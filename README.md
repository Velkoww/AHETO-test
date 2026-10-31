# Занималня АНЕТО: сайт за GitHub Pages

Страници: index.html (Начало), programa.html, za-nas.html (с играта), blog.html и три статии (blog-*.html), vaprosi.html, kontakti.html
Общи файлове: style.css, app.js, og.png, robots.txt, sitemap.xml

## Как се пуска
1. Създайте хранилище в GitHub и качете всички файлове в основната папка (без подпапка).
2. Settings > Pages > Source: Deploy from a branch > main > / (root).
3. След минута сайтът е на https://ИМЕ.github.io/ХРАНИЛИЩЕ/ (или на собствен домейн през Pages > Custom domain).
4. Заменете YOUR-DOMAIN във всички .html файлове (og:image), robots.txt и sitemap.xml с реалния адрес.

## Какво се сменя, когато клиентът даде данни
Почти всичко е в блока CONFIG в началото на app.js (една промяна се отразява на всички страници):
- телефон, адрес, работно време;
- gaId: Google Analytics 4;
- reviews: отзивите от Google;
- photos: снимки;
- formEndpoint и formAccessKey: формата.

## Google Analytics
1. В Google Analytics създайте поток за уеб и копирайте Measurement ID (изглежда като G-ABC123XYZ0).
2. Впишете го в CONFIG.gaId в app.js.
Скриптът на Google се зарежда само след като посетителят натисне „Приемам всички“ (или включи „Анализ“ в настройките). Без съгласие нищо не се зарежда и няма бисквитки за анализ.
Записват се събития: click_to_call, click_viber, click_whatsapp, click_directions, click_google_maps, map_load, generate_lead (изпратена форма), game_win. В Google Analytics маркирайте generate_lead и click_to_call като „Key events“.

## Отзиви
Копирайте реалните отзиви от Google Maps и ги впишете в CONFIG.reviews:
reviews:[{name:'Име',text:'Текст на отзива',stars:5,when:'преди 2 години'}]
Докато списъкът е празен, на началната страница стои място за отзиви. Питайте авторите или клиента за разрешение за публикуване на имената.

## Блог
Статиите са примерни. За нова статия копирайте blog-domashni.html под ново име, сменете текста и добавете връзка в blog.html, index.html и sitemap.xml.

## Примерно съдържание
Текстовете с оранжево пунктирано подчертаване (клас "ph") са примерни. Търсете ph в .html файловете, заменете ги и махнете класа. Програмата на деня, пакетите, екипът, статиите и отговорите на въпросите също са примерни.
Политиката за поверителност е шаблон, не юридически съвет. Попълнете администратора на данните.

## Формата
GitHub Pages е статичен хостинг, затова формата има нужда от услуга за форми:
- Web3Forms: безплатен ключ. В CONFIG: formEndpoint 'https://api.web3forms.com/submit' и formAccessKey 'ВАШИЯТ_КЛЮЧ'.
- Formspree: formEndpoint 'https://formspree.io/f/XXXX'.
Докато formEndpoint е празен, формата работи в демо режим и нищо не изпраща.
