package main

import (
	"fmt"
	"strconv"
	"strings"
)

type ListNode struct {
	Val  int
	Next *ListNode
}

func (l *ListNode) String() string {
	if l == nil {
		return ""
	}
	var data []string
	c := l
	for {
		if c == nil {
			break
		}
		data = append(data, strconv.Itoa(c.Val))
		c = c.Next
	}
	return "[" + strings.Join(data, ",") + "]"
}

func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {

	curr1 := l1
	curr2 := l2
	x, y, carry := 0, 0, 0
	var result *ListNode
	var prev *ListNode
	for {
		if curr1 == nil && curr2 == nil {
			break
		}
		if curr1 != nil {
			x = curr1.Val
			curr1 = curr1.Next
		} else {
			x = 0
		}
		if curr2 != nil {
			y = curr2.Val
			curr2 = curr2.Next
		} else {
			y = 0
		}
		res := x + y + carry
		next := &ListNode{
			Val: res % 10,
		}
		carry = res / 10

		if result == nil {
			result = next
			prev = result
		} else {
			prev.Next = next
			prev = next
		}
	}

	if carry != 0 {
		prev.Next = &ListNode{
			Val: carry,
		}
	}

	return result
}

func main() {
	l1 := &ListNode{
		Val: 2,
		Next: &ListNode{
			Val: 4,
			Next: &ListNode{
				Val:  3,
				Next: nil,
			},
		},
	}

	l2 := &ListNode{
		Val: 5,
		Next: &ListNode{
			Val: 6,
			Next: &ListNode{
				Val:  4,
				Next: nil,
			},
		},
	}

	results := addTwoNumbers(l1, l2)

	fmt.Println(results)
}
