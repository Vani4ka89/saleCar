<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

                   Sale🚘Car Application instruction

Для того щоб запустити наш додаток відкриваємо файл package.json та запускаємо 2 команди:
docker:start:local  - запускаємо базу даних PostgreSQL на Docker.
start:dev - запускаємо наш додаток. Або ж нижче є вказані відповідні команди.

1. Реєструємо користувача. При 1-му запуску додатку автоматично створюється користувач Адмін .
2. Логінимося . Ім'я вводити не обов'язково лише email та пароль.
3. Можемо оновити токени .
4. Можемо вийти із системи.

5. Змінити тип аккаунта користувача може лише адміністратор.
6. Змінити роль користувача може лише адміністратор.
7. Забанити користувача може менеджер.
8. Розбанити користувача може менеджер.
9. Дістати усіх користувачів може менеджер.
10. Користувач може побачити свій профіль.
11. Користувач може оновити свій профіль.
12. Видалити користувача може лише адміністратор.

13. Користувач може створити оголошення лише 1 якщо у нього акаунт базовий та коли акаунт Преміум то користувач може створити багато оголошень. Якщо в описі присутня ненормативна лексика то буде помилка і оголошення не створиться.
14. Можемо отримати усі оголошення.
15. Ми можемо повідомити якщо відсутній бренд. При цьому буде відправлено повідомлення в адміністрацію.
16. Можемо побачити лише свої оголошення.
17. Можемо побачити інформацію оголошення якщо в нас акаунт базовий то лише деяку інформацію та коли у нас акаунт Преміум то можемо побачити більше інформації наприклад: кількість переглядів оголошення, кількість переглядів за день, за тиждень, за місяць, середню ціну по регіону та середню ціну загальну. А також інформацію користувача якому належить дане оголошення.
18. Можемо оновити дані в своєму оголошенні. Дані можемо вводити ті які нам потрібно оновити не обов'язково вводити всі дані. Оголошення можемо оновити лише 3 рази. Після третьої спроби статус оголошення буде неактивним та буде повідомлено адміністрацію. При редагуванні також присутня перевірка лексики.
19. Видалити оголошення може лише адміністратор.
20. Також ми можемо завантажити фото для нашого оголошення та записати відповідну інформацію в базу даних. Фото завантажується на сервіс AWS.

Також нагадую що адміністратор має всі дозволи до нашого додатку (там де вказані права менеджера також є доступними для адміністратора).

Пароль адміністратора                           
P@$$word123qwe

Email адміністратора                               
admin@gmail.com

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run docker:start:local
```

```bash
# watch mode
$ npm run start:dev
```

```bash
# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
