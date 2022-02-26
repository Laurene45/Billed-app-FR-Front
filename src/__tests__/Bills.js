/**
 * @jest-environment jsdom
 */

 import {fireEvent, screen, waitFor} from "@testing-library/dom"
 import BillsUI from "../views/BillsUI.js"
 import { bills } from "../fixtures/bills.js"

 import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 import mockStore from "../__mocks__/store"
 import router from "../app/Router.js";
 import Bills from "../containers/Bills.js"

jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  // Quand je suis sur la page NDF
  describe("When I am on Bills Page", () => {
    // TEST : L'icône de la NDF dans la barre verticale doit être mise en surbrillance
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      //Jest va tester si le résultat de expect() correspond au “matcher”.
      const iconActivated = windowIcon.classList.contains('active-icon')
      //matcher ToBeTruthy : assurer qu'une valeur est vraie dans un contexte booléen
      expect(iconActivated).toBeTruthy()
    })

    // TEST : Les factures doivent être commandées du plus ancien au plus récent
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML);
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      //autre solution dans le test => changement du calcul : const antiChrono = (a, b) => b.date - a.date
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  // Quand je suis sur la page NDF avec une erreur
  describe("When I am on Bills page with an error", () => {
    // TEST : Page erreur doit s'afficher
    test("Then Error page should be displayed", () => {
        const html = BillsUI({ data: bills, error: true });
        document.body.innerHTML = html;
        const hasError = screen.getAllByText("Erreur");
        expect(hasError).toBeTruthy();
    })
  }) 

  // Quand la page NDF est en chargement
  describe("When I am on Bills page and it's loading", () => {
    // TEST : La page doit s'afficher après chargement
    test("Then Loading page should be displayed", () => {
        const html = BillsUI({ data: bills, loading: true });
        document.body.innerHTML = html;
        const isLoading = screen.getAllByText("Loading...");
        expect(isLoading).toBeTruthy();
    })
  })

  // Clic sur une nouvelle NDF
  describe("When I click on button 'Nouvelle note de frais'", () => {
    // TEST : Page nouvelle de Frais doit s'afficher
    test("Then I should be sent on the new bill page", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
        const html = BillsUI({data : bills})
        document.body.innerHTML = html
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({pathname})
        }
        const mockBills = new Bills({document, onNavigate, localStorage, store: null});
        const btnNewBill = screen.getByTestId('btn-new-bill');

        //Simulation de la fonction handleClick pour Nouvelle NDF
        const mockFunctionHandleClick = jest.fn(mockBills.handleClickNewBill);
        btnNewBill.addEventListener('click',mockFunctionHandleClick)
        //FireEvent : Initialise la méthode
        fireEvent.click(btnNewBill)
        //matcher : toHaveBeenCalled : s'assurer qu'une fonction fictive a été appelée avec des arguments spécifiques.
        expect(mockFunctionHandleClick).toHaveBeenCalled();
        expect(mockFunctionHandleClick).toHaveBeenCalledTimes(1);
    }) 
  })

  //Clic sur l'icône pour visualiser la NDF
  describe("When I click on first eye icon", () => {
    // Test : La modale doit s'ouvrir
    test("Then modal should open", () => {
      Object.defineProperty(window, localStorage, {value: localStorageMock})
      window.localStorage.setItem("user", JSON.stringify({type: 'Employee'}))
      // on ajoute le Html et la navigation
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const billsContainer = new Bills({document, onNavigate, localStorage:localStorageMock, store: null});

      //Simulation de la modale pour l'ouverture au clic
      $.fn.modal = jest.fn();

      //Simulation de la fonction handleClickIconEye 
      const handleClickIconEye = jest.fn(() => {billsContainer.handleClickIconEye});
      const firstEyeIcon = screen.getAllByTestId("icon-eye")[0];
      firstEyeIcon.addEventListener("click", handleClickIconEye)
      fireEvent.click(firstEyeIcon)
      expect(handleClickIconEye).toHaveBeenCalled();
      expect($.fn.modal).toHaveBeenCalled();
    })
  })
})
