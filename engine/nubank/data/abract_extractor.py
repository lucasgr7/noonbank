from abc import ABC, abstractmethod


class ExtractorAbstract(ABC):
    @abstractmethod
    def extract(self, data):
        pass
    
    @abstractmethod
    def transform(self, data):
        pass
    
    @abstractmethod
    def send(self, data):
        pass
    
    @abstractmethod
    def execute(self, data):
        pass