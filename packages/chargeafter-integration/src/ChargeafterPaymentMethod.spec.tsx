import {
    CheckoutSelectors,
    CheckoutService,
    createCheckoutService,
    createLanguageService
} from "@bigcommerce/checkout-sdk";
import {PaymentFormService, PaymentMethodProps} from "@bigcommerce/checkout/payment-integration-api";
import React, {FunctionComponent} from "react";
import {createLocaleContext, LocaleContext, LocaleContextType} from "@bigcommerce/checkout/locale";
import {getCart, getCustomer, getPaymentFormServiceMock, getStoreConfig} from "@bigcommerce/checkout/test-mocks";
import {mount} from "enzyme";
import ChargeafterPaymentMethod from "./ChargeafterPaymentMethod";
import {HostedPaymentComponent} from "@bigcommerce/checkout/hosted-payment-integration";

describe('Chargeafter Payment Method', () => {
    let checkoutService: CheckoutService;
    let defaultProps: PaymentMethodProps;

    let checkoutState: CheckoutSelectors;
    let paymentForm: PaymentFormService;

    let PaymentMethodTest: FunctionComponent<PaymentMethodProps>;
    let localeContext: LocaleContextType;

    beforeEach(() => {
        checkoutService = createCheckoutService();
        checkoutState = checkoutService.getState();
        paymentForm = getPaymentFormServiceMock();

        jest.spyOn(checkoutState.data, 'getConfig').mockReturnValue(getStoreConfig());
        jest.spyOn(checkoutState.data, 'getCart').mockReturnValue(getCart());
        jest.spyOn(checkoutState.data, 'getCustomer').mockReturnValue(getCustomer());
        jest.spyOn(checkoutService, 'deinitializePayment').mockResolvedValue(checkoutState);
        
        localeContext = createLocaleContext(getStoreConfig());
        
        defaultProps = {
            method: {
                id: "chargeafter",
                method: "chargeafter",
                supportedCards: [],
                config: {},
                type: "card",
                gateway: "chargeafter"
            },
            checkoutService,
            checkoutState,
            paymentForm,
            language: createLanguageService(),
            onUnhandledError: jest.fn()
        }

        PaymentMethodTest = (props) => (
            <LocaleContext.Provider value={localeContext}>
                <ChargeafterPaymentMethod {...props} />
            </LocaleContext.Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initializes method with required config', () => {
        const component = mount(<PaymentMethodTest {...defaultProps} />);

        expect(component.find(HostedPaymentComponent)).toHaveLength(1);
    });
});