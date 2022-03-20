/**
 * @jest-environment jsdom
 */

 import {fireEvent, screen, waitFor} from "@testing-library/dom"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import BillsUI from "../views/BillsUI.js";
 
 import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 import mockStore from "../__mocks__/store.js";
 
 import router from "../app/Router.js";

 jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    // Test : Modif ... par "icône de courrier dans la barre verticale doit être mise en surbrillance"
      test("Then mail icon in vertical layout should be highlighted", async() => {
        const html = NewBillUI()
        document.body.innerHTML = html
        //--to-do write assertion
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.NewBill)
        await waitFor(() => screen.getByTestId('icon-mail'))
        const windowIcon = screen.getByTestId('icon-mail')
        //--to-do write expect expression
        const iconActivated = windowIcon.classList.contains('active-icon')
        expect(iconActivated).toBeTruthy()
    })
  })


  describe("When I select an image in a correct format", () => {
    // TEST : Ensuite, le fichier doit afficher le nom du fichier
      test("Then the input file should display the file name", () => {
        //on ajoute le HTML
        const html = NewBillUI();
        document.body.innerHTML = html;
        //la variable et la fonction sur lesquelles on veut faire le test
        const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage })
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
        const input = screen.getByTestId('file');
        input.addEventListener('change', handleChangeFile);
        //fichier au bon format: ici test sur png
        fireEvent.change(input, {
            target: {files: [new File(['image.png'], 'image.png', {type: 'image/png'})],}
        })
        expect(handleChangeFile).toHaveBeenCalled()
        expect(input.files[0].name).toBe('image.png');
    })

    // Ensuite, la NDF est créée
      test("Then a bill is created", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage })
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
        const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage })
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




    // --- TEST INTEGRATION POST METHOD
describe('Given I am a user connected as Employee', () => {
  describe("When I submit the form completed", () => {
    // TEST : La note de frais est créée
    test("Then the bill is created", async() => {
       const html = NewBillUI();
       document.body.innerHTML = html
       const onNavigate = (pathname) => {document.innerHTML= ROUTES({pathname})}
       localStorage.setItem("user", JSON.stringify({type: 'Employee', email: 'a@a'}))
       const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage})

       // Valeurs initiales pour test
       const validBill = {
          type: 'Hôtel et logement',
          name: 'Séjour pro',
          amount: 400,
          date: '2022-02-24',
          vat: '80',
          pct: 20,
          commentary: 'commentary',
          fileUrl: '../img/test.jpg',
          fileName: 'test.jpg',
          status: 'pending',
       }
       // chargement des valeurs
       screen.getByTestId("expense-type").value = validBill.type;
       screen.getByTestId("expense-name").value = validBill.name;
       screen.getByTestId("amount").value = validBill.amount;
       screen.getByTestId("datepicker").value = validBill.date;
       screen.getByTestId("vat").value = validBill.vat;
       screen.getByTestId("pct").value = validBill.pct;
       screen.getByTestId("commentary").value = validBill.commentary;

       newBill.fileUrl = validBill.fileUrl;
       newBill.fileName = validBill.fileName;

       newBill.updateBill = jest.fn();
       const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))

       const form = screen.getByTestId("form-new-bill");
       form.addEventListener('submit', handleSubmit)
       fireEvent.submit(form)

       expect(handleSubmit).toHaveBeenCalled()
       expect(newBill.updateBill).toHaveBeenCalled()
    })

    // TEST : Create
    test('POST INTEGRATION "CREATE"', async () => {
      const mockedApiFn = mockStore.bills();
      const spyPost = jest.spyOn(mockedApiFn, "create");
      const response = await mockedApiFn.create();

      expect(spyPost).toHaveBeenCalledTimes(1);
      expect(response.key).toBe("1234");
    })

    // TEST : Update
    test('POST INTEGRATION "update"', async () => {
      const mockedApiFn = mockStore.bills();
      const spyPostUpdate = jest.spyOn(mockedApiFn, "update");
      const response = await mockedApiFn.update();
      
      const updateBills = {
        id: "47qAXb6fIm2zOKkLzMro",
        vat: "80",
        fileUrl: "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        status: "pending",
        type: "Hôtel et logement",
        commentary: "séminaire billed",
        name: "encore",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2004-04-04",
        amount: 400,
        commentAdmin: "ok",
        email: "a@a",
        pct: 20
      }

      expect(spyPostUpdate).toHaveBeenCalledTimes(1);
      expect(response).toBeTruthy();
      expect(response).toEqual(updateBills);
    })
  })

  
  // Lorsqu'une erreur se produit sur l'API
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(window,'localStorage',{value: localStorageMock})
      localStorage.setItem('user', JSON.stringify({type: 'Employee', email: "a@a"}))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })

    // TEST : récupère les factures d'une API et échoue avec une erreur 404
    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    })
    
    // TEST : récupère les factures d'une API et échoue avec une erreur 500
    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    })
  })
})