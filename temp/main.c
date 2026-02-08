#include <stdio.h>

int main() {
    int a, b, somme;

    printf("Tape a : ");
    scanf("%i",&a);
    printf("Tape b : ");
    scanf("%i",&b);

    somme = a + b;

    printf("La somme de %i + %i = %i", a, b, somme);
    return 0;
}