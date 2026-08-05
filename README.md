# Luna

Fundação visual e navegável do copiloto mobile de estudos Luna. Esta versão usa apenas dados e serviços mockados locais.

## Requisitos

- NVM
- Node.js 22.13 ou superior
- npm 10 ou superior
- Expo Go compatível com SDK 57 ou um development build

## Execução

```bash
nvm use
npm install
npm start
```

O projeto inclui `.nvmrc`. Na primeira execução, se necessário, instale a versão correta com `nvm install 22`.

No terminal do Expo, escaneie o QR Code com o Expo Go ou use `npm run android`, `npm run ios` (macOS) ou `npm run web`.

## Verificações

```bash
npm run typecheck
npm run lint
npx expo-doctor
```

## Arquitetura

- `app/`: rotas declarativas do Expo Router.
- `src/screens/`: composição de cada tela.
- `src/components/`: componentes comuns, dashboard e navegação.
- `src/data/`: dados mockados tipados.
- `src/services/`: regras locais substituíveis por integrações futuras.
- `src/theme/`: tokens visuais centralizados.
- `src/types/`: contratos de domínio.
- `src/utils/`: cálculos e formatação sem dependência de UI.

## Escopo atual

Não há backend, autenticação real, IA, uploads, notificações, pagamentos, persistência ou sincronização em nuvem. Botões que representam essas capacidades exibem somente o fluxo visual do protótipo.
