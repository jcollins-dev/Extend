This folder represents new folder structure as we start working on Proseal.
'Components' folder was created to separate new components/pages/providers etc. from other content in codebase in hopes to imporve how to structure things.

'Components' will comtain larger components using elements from UI folder, no business logic here.

Full outline of new folder strcuture can be found in main readme

Run `npx generate-react-cli component MyNewComponent --path=src/common/components` - this will create a new folder `src/common/components` with `MyNewComponent.tsx` and `MyNewComponent.test.tsx`
