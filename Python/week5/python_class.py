# ----------------------------
# Library Management System
# ----------------------------

# Book class
class Book:
    def __init__(self, title, author, isbn):
        self.__title = title          # private attribute
        self.__author = author
        self.__isbn = isbn
        self.__is_available = True

    # Getter methods
    def get_title(self):
        return self.__title

    def is_available(self):
        return self.__is_available

    # Methods
    def display_info(self):
        status = "Available" if self.__is_available else "Borrowed"
        print(f"Title: {self.__title}, Author: {self.__author}, ISBN: {self.__isbn}, Status: {status}")

    def borrow(self):
        if self.__is_available:
            self.__is_available = False
            print(f"{self.__title} has been borrowed.")
        else:
            print(f"{self.__title} is currently unavailable.")

    def return_book(self):
        self.__is_available = True
        print(f"{self.__title} has been returned.")


# Member class
class Member:
    def __init__(self, name, member_id):
        self.__name = name
        self.__member_id = member_id
        self.__borrowed_books = []

    # Methods
    def borrow_book(self, book):
        if book.is_available():
            book.borrow()
            self.__borrowed_books.append(book)
        else:
            print(f"Cannot borrow {book.get_title()}.")

    def return_book(self, book):
        if book in self.__borrowed_books:
            book.return_book()
            self.__borrowed_books.remove(book)
        else:
            print(f"{self.__name} did not borrow {book.get_title()}.")

    def display_info(self):
        print(f"Member: {self.__name}, ID: {self.__member_id}")
        print("Borrowed Books:")
        for book in self.__borrowed_books:
            print(f"- {book.get_title()}")

# Optional subclass example: PremiumMember
class PremiumMember(Member):
    def __init__(self, name, member_id):
        super().__init__(name, member_id)

    # Overriding display_info method
    def display_info(self):
        print(f"Premium Member: {self._Member__name}, ID: {self._Member__member_id}")
        super().display_info()

# Main program
if __name__ == "__main__":
    # Create some books
    book1 = Book("Python Basics", "Alice Smith", "12345")
    book2 = Book("Data Structures", "Bob Johnson", "67890")

    # Create members
    member1 = Member("John Doe", "M001")
    premium_member = PremiumMember("Jane Roe", "M002")

    # Borrow and return books
    member1.borrow_book(book1)
    premium_member.borrow_book(book2)

    # Display info
    book1.display_info()
    book2.display_info()
    member1.display_info()
    premium_member.display_info()
