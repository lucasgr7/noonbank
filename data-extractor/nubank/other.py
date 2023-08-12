
# Retorna um dicionário contendo os detalhes de uma transação retornada por get_card_statements()
# Contém as parcelas da transação
card_statement_details = nu.get_card_statement_details(card_statements[0])

# Soma de todas as compras
print(sum([t['amount'] for t in card_statements]))

# Lista de dicionários contendo todas as faturas do seu cartão de crédito
bills = nu.get_bills()

# Retorna um dicionário contendo os detalhes de uma fatura retornada por get_bills()
bill_details = nu.get_bill_details(bills[1])

# description':# 'Openai'
# 'category':# 'transaction'
# 'amount':# 11526
# 'time':# '2023-08-08T06:50:53Z'
# 'source':# 'upfront_foreign'
# 'title':# 'eletrônicos'
# 'amount_without_iof':# 10938
# 'account':# '5efcf41c-82de-4e6a-b21f-53ca1e49a395'
# 'details':# {'status': 'settled', 'fx': {'currency_origin': 'USD', 'amount_origin': 2137, 'amount_usd': 2137, 'precise_amount_origin': '21.37', 'precise_amount_usd': '21.37', 'exchange_rate': 5.118390266729059}, 'subcategory': 'card_not_present'}
# 'id':# '64d1e5cf-857f-4b0e-ba9e-564a919e643b'
# '_links':# {'self': {'href': 'https://prod-global-...kxOWU2NDNi'}}
# 'tokenized':# True
# 'href':# 'nuapp://transaction/64d1e5cf-857f-4b0e-ba9e-564a919e643b'

docker run -it --rm  --volume //var/run/docker.sock:/var/run/docker.sock  --volume "%cd%"/appwrite:/usr/src/code/appwrite:rw  --entrypoint="install"  appwrite/appwrite:1.3.8