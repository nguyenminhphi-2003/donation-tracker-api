import moment from 'moment';
import crypto from 'crypto';

export const createPaymentUrl = (amount: number, bankCode: string = "", ipAddr: string) => {
  // const TZ = 'Asia/Ho_Chi_Minh';

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');

  const tmnCode: string = process.env.VNP_TMN_CODE!;
  const secretKey: string = process.env.VNP_HASH_SECRET!;
  let vnpUrl: string = process.env.VNP_URL!;
  const returnUrl: string = process.env.VNP_RETURN_URL!;
  const orderId = moment(date).format('DDHHmmss');

  const locale = 'vn';
  const currCode = 'VND';
  let vnp_Params: { [key: string]: string | number } = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const params = new URLSearchParams(vnp_Params as any);
  const signData = params.toString();
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  params.append('vnp_SecureHash', signed);
  vnpUrl += '?' + params.toString();

  return vnpUrl;
};

const sortObject = (obj: { [key: string]: any }) => {
  const sorted: { [key: string]: any } = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
};