package com.project.ManagementSystem;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;


class ManagementSystemApplicationTests {

	Calculator underTest = new Calculator();
	@Test
	void itShouldAddTwoNumbers() {
		// given
		int numberOne = 20;
		int numberTwo = 30;

		// when

		int result = underTest.add(numberOne, numberTwo);

		// then
		assertThat(result).isEqualTo(50);
	}

	class Calculator {
		int add(int a, int b){
			return a+b;
		}
	}

}
