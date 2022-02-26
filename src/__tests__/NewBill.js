/**
 * @jest-environment jsdom
 */

 import { screen, waitFor, fireEvent } from "@testing-library/dom"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 
 import { ROUTES_PATH } from "../constants/routes.js";
 import { localStorageMock } from "../__mocks__/localStorage.js";
 
 import router from "../app/Router.js";
 import store from "../__mocks__/store.js";


describe("Given I am connected as an employee", () => {
  //quand je suis sur la page Nouvelle NDF
  describe("When I am on NewBill Page", () => {
    // Modif ... par "icône de courrier dans la barre verticale doit être mise en surbrillance"
      test("Then mail icon in vertical layout should be highlighted", async() => {
        const html = NewBillUI()
        document.body.innerHTML = html
        //to-do write assertion
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.NewBill)
        await waitFor(() => screen.getByTestId('icon-mail'))
        const windowIcon = screen.getByTestId('icon-mail')
        //to-do write expect expression
        const iconActivated = windowIcon.classList.contains('active-icon')
        expect(iconActivated).toBeTruthy()
    })
  })

  //quand je sélectionne une image dans un format ok
  describe("When I select an image in a correct format", () => {
    // Ensuite, le fichier  doit afficher le nom du fichier
      test("Then the input file should display the file name", () => {
        //on ajoute le HTML
        const html = NewBillUI();
        document.body.innerHTML = html;
        //la variable et la fonction sur lesquelles on veut faire le test
        const newBill = new NewBill({ document, onNavigate, store, localStorage })
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
        const input = screen.getByTestId('file');
        input.addEventListener('change', handleChangeFile);
        //fichier au bon format: ici test sur png
        fireEvent.change(input, {
            target: {files: [new File(['image.png'], 'image.png', {type: 'image/png'})],}
        })
        //matcher : toHaveBeenCalled : s'assurer qu'une fonction fictive a été appelée avec des arguments spécifiques.
        expect(handleChangeFile).toHaveBeenCalled()
        expect(input.files[0].name).toBe('image.png');
    })

    // Ensuite, la NDF est créée
      test("Then a bill is created", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        const newBill = new NewBill({ document, onNavigate, store: null, localStorage })
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        const submit = screen.getByTestId('form-new-bill');
        submit.addEventListener('submit', handleSubmit);
        fireEvent.submit(submit)
        expect(handleSubmit).toHaveBeenCalled();
    })
  

  // Ensuite, la NDF est supprimée si mauvais format
      test("Then the bill is deleted", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        const newBill = new NewBill({ document, onNavigate, store: null, localStorage })
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
        const input = screen.getByTestId('file');
        input.addEventListener('change', handleChangeFile);
        //fichier au mauvais format
        fireEvent.change(input, {
            target: {files: [new File(['image.txt'], 'image.txt', {type: 'image/txt'})],
            }
        })
        expect(handleChangeFile).toHaveBeenCalled();
        expect(handleChangeFile).toHaveBeenCalledTimes(1);
        expect(input.files[0].name).toBe('image.txt');
    })
  })
})
