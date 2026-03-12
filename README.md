Aplicação de gestão de pessoas

## Configuração mínima de autenticação

Adicione ao `.env`:

- `AUTH_SECRET` - chave forte de criptografia JWT (ex: `alguma-coisa-muito-secreta`)
- `AUTH_USERS` - objeto JSON com usuário:senha ou usuário:hash

Exemplo (senha em texto para ambiente controlado):

```
AUTH_SECRET=alguma-coisa-muito-secreta
AUTH_USERS={"rodrigo":"minhasenha","guilherme":"outrasenha"}
```

Recomendado (hash usando utils):

- executar script Node com `hashPassword` para gerar `salt:hash`
- salvar em `AUTH_USERS`:

```
AUTH_USERS={"rodrigo":"<salt>:<hash>"}
```

## Dependências

- `next`, `react`, `react-dom`
- `jose` (token JWT)

## Comandos

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`


