#include <iostream>
#include <vector>
#include <string>
#include <cstdlib>
#include <ctime>
#include <algorithm>
#include <chrono>
#include <thread>

using namespace std;

// ============================================================
// QUESTION CLASS - Base class
// ============================================================
class Question {
protected:
    string questionText;
    vector<string> options;
    int correctAnswer;

public:
    Question(string q, vector<string> o, int answer)
        : questionText(q), options(o), correctAnswer(answer) {}

    virtual void display() const = 0;

    virtual bool checkAnswer(int answer) const {
        return answer == correctAnswer;
    }

    virtual ~Question() {}
};

// ============================================================
// MCQ QUESTION - Inheritance + Polymorphism
// ============================================================
class MCQQuestion : public Question {
public:
    MCQQuestion(string q, vector<string> o, int answer)
        : Question(q, o, answer) {}

    void display() const override {
        cout << "\n" << questionText << "\n";

        for (int i = 0; i < options.size(); i++) {
            cout << "  " << i + 1 << ". " << options[i] << "\n";
        }
    }
};

// ============================================================
// LANGUAGE CLASS - Abstraction
// ============================================================
class Language {
public:
    virtual string get(string key) const = 0;
    virtual ~Language() {}
};

// ============================================================
// ENGLISH
// ============================================================
class English : public Language {
public:
    string get(string key) const override {
        if (key == "title") return "QUIZ GAME SYSTEM";
        if (key == "language") return "Select Language";
        if (key == "age") return "Select Age Group";
        if (key == "theme") return "Select Theme";
        if (key == "mode") return "Select Quiz Mode";
        if (key == "time") return "Select Time in seconds";
        if (key == "questions") return "Enter number of questions";
        if (key == "answer") return "Enter your answer";
        if (key == "correct") return "Correct!";
        if (key == "wrong") return "Wrong!";
        if (key == "result") return "FINAL RESULT";
        if (key == "score") return "Score";
        if (key == "replay") return "Replay";
        if (key == "home") return "Return to Home";
        return "";
    }
};

// ============================================================
// TELUGU
// ============================================================
class Telugu : public Language {
public:
    string get(string key) const override {
        if (key == "title") return "క్విజ్ గేమ్ సిస్టమ్";
        if (key == "language") return "భాషను ఎంచుకోండి";
        if (key == "age") return "వయస్సు సమూహాన్ని ఎంచుకోండి";
        if (key == "theme") return "థీమ్ ఎంచుకోండి";
        if (key == "mode") return "క్విజ్ మోడ్ ఎంచుకోండి";
        if (key == "time") return "సమయాన్ని సెకన్లలో ఎంచుకోండి";
        if (key == "questions") return "ప్రశ్నల సంఖ్యను నమోదు చేయండి";
        if (key == "answer") return "మీ సమాధానం నమోదు చేయండి";
        if (key == "correct") return "సరైన సమాధానం!";
        if (key == "wrong") return "తప్పు సమాధానం!";
        if (key == "result") return "తుది ఫలితం";
        if (key == "score") return "స్కోర్";
        if (key == "replay") return "మళ్లీ ఆడండి";
        if (key == "home") return "హోమ్‌కు తిరిగి వెళ్ళండి";
        return "";
    }
};

// ============================================================
// HINDI
// ============================================================
class Hindi : public Language {
public:
    string get(string key) const override {
        if (key == "title") return "क्विज़ गेम सिस्टम";
        if (key == "language") return "भाषा चुनें";
        if (key == "age") return "आयु समूह चुनें";
        if (key == "theme") return "थीम चुनें";
        if (key == "mode") return "क्विज़ मोड चुनें";
        if (key == "time") return "समय सेकंड में चुनें";
        if (key == "questions") return "प्रश्नों की संख्या दर्ज करें";
        if (key == "answer") return "अपना उत्तर दर्ज करें";
        if (key == "correct") return "सही उत्तर!";
        if (key == "wrong") return "गलत उत्तर!";
        if (key == "result") return "अंतिम परिणाम";
        if (key == "score") return "स्कोर";
        if (key == "replay") return "फिर से खेलें";
        if (key == "home") return "होम पर वापस जाएं";
        return "";
    }
};

// ============================================================
// QUIZ CLASS
// ============================================================
class Quiz {
private:
    vector<Question*> questions;
    Language* language;
    string ageGroup;
    string theme;

    int score;
    int correct;
    int wrong;

public:

    Quiz(Language* lang, string age, string selectedTheme)
        : language(lang),
          ageGroup(age),
          theme(selectedTheme),
          score(0),
          correct(0),
          wrong(0) {}

    ~Quiz() {
        for (Question* q : questions)
            delete q;
    }

    // --------------------------------------------------------
    // ADD QUESTIONS
    // --------------------------------------------------------
    void loadQuestions() {

        // ---------------- SCIENCE ----------------
        if (theme == "Science") {

            questions.push_back(new MCQQuestion(
                "Which planet is known as the Red Planet?",
                {"Earth", "Mars", "Jupiter", "Venus"}, 2));

            questions.push_back(new MCQQuestion(
                "What gas do humans need to breathe?",
                {"Oxygen", "Carbon Dioxide", "Hydrogen", "Helium"}, 1));

            questions.push_back(new MCQQuestion(
                "What is H2O commonly known as?",
                {"Salt", "Water", "Oxygen", "Hydrogen"}, 2));

            questions.push_back(new MCQQuestion(
                "Which organ pumps blood around the body?",
                {"Brain", "Lung", "Heart", "Kidney"}, 3));

            questions.push_back(new MCQQuestion(
                "What force pulls objects toward Earth?",
                {"Magnetism", "Gravity", "Friction", "Electricity"}, 2));
        }

        // ---------------- MATHEMATICS ----------------
        else if (theme == "Mathematics") {

            questions.push_back(new MCQQuestion(
                "What is 12 + 8?",
                {"18", "20", "22", "24"}, 2));

            questions.push_back(new MCQQuestion(
                "What is 9 × 7?",
                {"56", "63", "72", "81"}, 2));

            questions.push_back(new MCQQuestion(
                "What is the square of 10?",
                {"20", "50", "100", "1000"}, 3));

            questions.push_back(new MCQQuestion(
                "What is 100 ÷ 4?",
                {"20", "25", "30", "40"}, 2));

            questions.push_back(new MCQQuestion(
                "How many sides does a triangle have?",
                {"2", "3", "4", "5"}, 2));
        }

        // ---------------- GENERAL KNOWLEDGE ----------------
        else if (theme == "General Knowledge") {

            questions.push_back(new MCQQuestion(
                "What is the capital of India?",
                {"Mumbai", "New Delhi", "Hyderabad", "Chennai"}, 2));

            questions.push_back(new MCQQuestion(
                "How many days are there in a week?",
                {"5", "6", "7", "8"}, 3));

            questions.push_back(new MCQQuestion(
                "Which is the largest ocean?",
                {"Atlantic", "Indian", "Arctic", "Pacific"}, 4));

            questions.push_back(new MCQQuestion(
                "Which language is mainly used to structure web pages?",
                {"HTML", "SQL", "C++", "Python"}, 1));

            questions.push_back(new MCQQuestion(
                "How many continents are commonly recognized?",
                {"5", "6", "7", "8"}, 3));
        }

        // ---------------- HISTORY ----------------
        else if (theme == "History") {

            questions.push_back(new MCQQuestion(
                "Who was known as the Father of the Nation in India?",
                {"Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "Subhas Chandra Bose"}, 2));

            questions.push_back(new MCQQuestion(
                "The Taj Mahal is located in which city?",
                {"Delhi", "Mumbai", "Agra", "Jaipur"}, 3));

            questions.push_back(new MCQQuestion(
                "Who was the first Prime Minister of India?",
                {"Jawaharlal Nehru", "Rajendra Prasad", "Sardar Patel", "B. R. Ambedkar"}, 1));

            questions.push_back(new MCQQuestion(
                "The Indus Valley Civilization developed mainly around which river system?",
                {"Indus", "Nile", "Amazon", "Danube"}, 1));

            questions.push_back(new MCQQuestion(
                "India became independent in which year?",
                {"1945", "1946", "1947", "1950"}, 3));
        }

        // ---------------- GEOGRAPHY ----------------
        else if (theme == "Geography") {

            questions.push_back(new MCQQuestion(
                "Which is the largest continent?",
                {"Africa", "Asia", "Europe", "Australia"}, 2));

            questions.push_back(new MCQQuestion(
                "Which is the longest river in India?",
                {"Ganga", "Yamuna", "Godavari", "Narmada"}, 1));

            questions.push_back(new MCQQuestion(
                "Which country is famous for the Great Wall?",
                {"India", "China", "Japan", "Korea"}, 2));

            questions.push_back(new MCQQuestion(
                "Which desert is located in India?",
                {"Sahara", "Gobi", "Thar", "Kalahari"}, 3));

            questions.push_back(new MCQQuestion(
                "What is the capital of Telangana?",
                {"Hyderabad", "Warangal", "Vijayawada", "Visakhapatnam"}, 1));
        }

        // ---------------- SPACE ----------------
        else if (theme == "Space") {

            questions.push_back(new MCQQuestion(
                "Which star is closest to Earth?",
                {"Sirius", "The Sun", "Polaris", "Vega"}, 2));

            questions.push_back(new MCQQuestion(
                "How many planets are in our Solar System?",
                {"7", "8", "9", "10"}, 2));

            questions.push_back(new MCQQuestion(
                "Which planet has prominent rings?",
                {"Mars", "Earth", "Saturn", "Mercury"}, 3));

            questions.push_back(new MCQQuestion(
                "What is Earth's natural satellite?",
                {"Sun", "Moon", "Mars", "Venus"}, 2));

            questions.push_back(new MCQQuestion(
                "Which planet is closest to the Sun?",
                {"Venus", "Earth", "Mercury", "Mars"}, 3));
        }

        // ---------------- TECHNOLOGY ----------------
        else if (theme == "Technology") {

            questions.push_back(new MCQQuestion(
                "What does CPU stand for?",
                {"Central Processing Unit",
                 "Computer Personal Unit",
                 "Central Program Utility",
                 "Control Processing User"}, 1));

            questions.push_back(new MCQQuestion(
                "Which device is used to move the pointer on a computer?",
                {"Keyboard", "Mouse", "Printer", "Speaker"}, 2));

            questions.push_back(new MCQQuestion(
                "Which company developed the Android operating system?",
                {"Google", "Microsoft", "IBM", "Intel"}, 1));

            questions.push_back(new MCQQuestion(
                "What does USB stand for?",
                {"Universal Serial Bus",
                 "United System Board",
                 "Universal System Base",
                 "User Serial Board"}, 1));

            questions.push_back(new MCQQuestion(
                "Which is a programming language?",
                {"HTML", "C++", "HTTP", "Wi-Fi"}, 2));
        }

        // ---------------- SPORTS ----------------
        else if (theme == "Sports") {

            questions.push_back(new MCQQuestion(
                "How many players are on a cricket team?",
                {"9", "10", "11", "12"}, 3));

            questions.push_back(new MCQQuestion(
                "Which sport uses a racket and shuttlecock?",
                {"Tennis", "Badminton", "Football", "Hockey"}, 2));

            questions.push_back(new MCQQuestion(
                "How many rings are on the Olympic symbol?",
                {"4", "5", "6", "7"}, 2));

            questions.push_back(new MCQQuestion(
                "Which sport is associated with Wimbledon?",
                {"Cricket", "Football", "Tennis", "Golf"}, 3));

            questions.push_back(new MCQQuestion(
                "Which sport is played with a bat and ball?",
                {"Cricket", "Swimming", "Boxing", "Athletics"}, 1));
        }

        // ---------------- ANIMALS & NATURE ----------------
        else if (theme == "Animals & Nature") {

            questions.push_back(new MCQQuestion(
                "Which animal is known as the king of the jungle?",
                {"Tiger", "Lion", "Elephant", "Bear"}, 2));

            questions.push_back(new MCQQuestion(
                "What is the largest land animal?",
                {"Elephant", "Giraffe", "Rhino", "Hippo"}, 1));

            questions.push_back(new MCQQuestion(
                "Which animal gives us wool?",
                {"Cow", "Sheep", "Horse", "Goat"}, 2));

            questions.push_back(new MCQQuestion(
                "Which bird is known for its colorful tail feathers?",
                {"Crow", "Peacock", "Sparrow", "Eagle"}, 2));

            questions.push_back(new MCQQuestion(
                "Which gas do plants absorb during photosynthesis?",
                {"Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"}, 3));
        }

        // ---------------- LITERATURE ----------------
        else if (theme == "Literature") {

            questions.push_back(new MCQQuestion(
                "Who wrote Romeo and Juliet?",
                {"William Shakespeare", "Charles Dickens",
                 "Mark Twain", "Jane Austen"}, 1));

            questions.push_back(new MCQQuestion(
                "What is a poem?",
                {"A type of computer",
                 "A piece of literary writing",
                 "A mathematical formula",
                 "A map"}, 2));

            questions.push_back(new MCQQuestion(
                "Who wrote The Jungle Book?",
                {"Rudyard Kipling", "J.K. Rowling",
                 "Leo Tolstoy", "Robert Frost"}, 1));

            questions.push_back(new MCQQuestion(
                "Which is a famous detective character?",
                {"Sherlock Holmes", "Harry Potter",
                 "Tom Sawyer", "Oliver Twist"}, 1));

            questions.push_back(new MCQQuestion(
                "A story with a moral lesson is often called a...",
                {"Fable", "Formula", "Dictionary", "Biography"}, 1));
        }
    }

    // --------------------------------------------------------
    // QUESTION MODE
    // --------------------------------------------------------
    void questionMode(int number) {

        if (number > questions.size())
            number = questions.size();

        score = 0;
        correct = 0;
        wrong = 0;

        random_shuffle(questions.begin(), questions.end());

        for (int i = 0; i < number; i++) {

            cout << "\n----------------------------------";
            cout << "\nQuestion " << i + 1 << " of " << number;
            cout << "\n----------------------------------";

            questions[i]->display();

            int answer;
            cout << "\n" << language->get("answer") << ": ";
            cin >> answer;

            if (questions[i]->checkAnswer(answer)) {
                cout << language->get("correct") << "\n";
                score += 10;
                correct++;
            } else {
                cout << language->get("wrong") << "\n";
                wrong++;
            }
        }

        showResults();
    }

    // --------------------------------------------------------
    // TIME MODE
    // --------------------------------------------------------
    void timeMode(int seconds) {

        score = 0;
        correct = 0;
        wrong = 0;

        random_shuffle(questions.begin(), questions.end());

        auto start = chrono::steady_clock::now();

        for (int i = 0; i < questions.size(); i++) {

            auto current = chrono::steady_clock::now();

            int elapsed =
                chrono::duration_cast<chrono::seconds>
                (current - start).count();

            if (elapsed >= seconds) {
                cout << "\nTime is up!\n";
                break;
            }

            cout << "\n----------------------------------";
            cout << "\nQuestion " << i + 1;
            cout << "\nTime Remaining: " << seconds - elapsed
                 << " seconds";
            cout << "\n----------------------------------";

            questions[i]->display();

            int answer;

            cout << "\n" << language->get("answer") << ": ";
            cin >> answer;

            current = chrono::steady_clock::now();

            elapsed =
                chrono::duration_cast<chrono::seconds>
                (current - start).count();

            if (elapsed >= seconds) {
                cout << "\nTime is up!\n";
                break;
            }

            if (questions[i]->checkAnswer(answer)) {
                cout << language->get("correct") << "\n";
                score += 10;
                correct++;
            } else {
                cout << language->get("wrong") << "\n";
                wrong++;
            }
        }

        showResults();
    }

    // --------------------------------------------------------
    // RESULTS
    // --------------------------------------------------------
    void showResults() {

        int total = correct + wrong;

        double accuracy = 0;

        if (total > 0)
            accuracy = ((double)correct / total) * 100;

        cout << "\n\n====================================";
        cout << "\n           " << language->get("result");
        cout << "\n====================================";

        cout << "\nTheme      : " << theme;
        cout << "\nAge Group  : " << ageGroup;
        cout << "\nCorrect    : " << correct;
        cout << "\nWrong      : " << wrong;
        cout << "\nAccuracy   : " << accuracy << "%";
        cout << "\n" << language->get("score")
             << "      : " << score;

        cout << "\n====================================\n";
    }
};

// ============================================================
// MAIN PROGRAM
// ============================================================
int main() {

    srand(time(0));

    cout << "\n============================================";
    cout << "\n              QUIZ GAME SYSTEM";
    cout << "\n============================================\n";

    // --------------------------------------------------------
    // LANGUAGE SELECTION
    // --------------------------------------------------------

    cout << "\n1. English";
    cout << "\n2. Telugu";
    cout << "\n3. Hindi";

    cout << "\n\nSelect Language: ";

    int languageChoice;
    cin >> languageChoice;

    Language* language;

    if (languageChoice == 2)
        language = new Telugu();

    else if (languageChoice == 3)
        language = new Hindi();

    else
        language = new English();

    cout << "\n" << language->get("title") << "\n";

    // --------------------------------------------------------
    // AGE GROUP
    // --------------------------------------------------------

    cout << "\n1. Kids";
    cout << "\n2. Teens";
    cout << "\n3. General";
    cout << "\n4. Advanced";

    int ageChoice;

    cout << "\n\n" << language->get("age") << ": ";
    cin >> ageChoice;

    string ageGroup;

    switch (ageChoice) {
        case 1: ageGroup = "Kids"; break;
        case 2: ageGroup = "Teens"; break;
        case 3: ageGroup = "General"; break;
        case 4: ageGroup = "Advanced"; break;
        default: ageGroup = "General";
    }

    // --------------------------------------------------------
    // THEMES
    // --------------------------------------------------------

    vector<string> themes = {
        "General Knowledge",
        "Science",
        "Mathematics",
        "History",
        "Geography",
        "Space",
        "Technology",
        "Sports",
        "Animals & Nature",
        "Literature"
    };

    cout << "\n" << language->get("theme") << ":\n";

    for (int i = 0; i < themes.size(); i++)
        cout << i + 1 << ". " << themes[i] << "\n";

    int themeChoice;

    cout << "\nEnter theme number: ";
    cin >> themeChoice;

    if (themeChoice < 1 || themeChoice > themes.size())
        themeChoice = 1;

    string selectedTheme = themes[themeChoice - 1];

    // --------------------------------------------------------
    // CREATE QUIZ OBJECT
    // --------------------------------------------------------

    Quiz quiz(language, ageGroup, selectedTheme);

    quiz.loadQuestions();

    // --------------------------------------------------------
    // QUIZ MODE
    // --------------------------------------------------------

    cout << "\n1. Select Time";
    cout << "\n2. Select Questions";

    int mode;

    cout << "\n\n" << language->get("mode") << ": ";
    cin >> mode;

    if (mode == 1) {

        int seconds;

        cout << "\n" << language->get("time")
             << " (30 / 60 / 120): ";

        cin >> seconds;

        quiz.timeMode(seconds);

    } else {

        int number;

        cout << "\n" << language->get("questions")
             << " (1 - 5): ";

        cin >> number;

        if (number < 1)
            number = 1;

        if (number > 5)
            number = 5;

        quiz.questionMode(number);
    }

    delete language;

    cout << "\nThank you for playing!\n";

    return 0;
}
