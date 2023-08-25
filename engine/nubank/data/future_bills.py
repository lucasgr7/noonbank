
# create an ExtractorAbstract class to extract data nu.get_bills()
from engine.nubank.data import abract_extractor


class FutureBills(abract_extractor):
    nu = None
    def __init__(self, url, apikey, cpf, password):
        self.url = url
        self.apikey = apikey
        self.cpf = cpf
        self.password = password

    def extract(self, data):
        pass

    def transform(self, data):
        pass

    def send(self, data):
        pass

    def execute(self, data):
        pass