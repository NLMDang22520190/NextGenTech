import React, { useState } from "react";
import { Form, Input, Card, Radio, Button, Row, Col, Typography } from "antd";
import { motion } from "framer-motion";
import { ShieldCheckIcon, Banknote } from "lucide-react";

import momo from "../../../assets/Payment/momo.svg";
import vnpay from "../../../assets/Payment/vnpay.svg";

const { Text, Title } = Typography;

export function CheckoutForm({ onSubmit, isProcessing, form }) {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleSubmit = (values) => {
    // Combine form values with payment method
    const completeSubmission = {
      ...values,
      paymentMethod,
    };
    onSubmit(completeSubmission);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6 flex flex-col gap-6"
      >
        {/* Personal Information */}
        <Card title={<Title level={4}>Personal Information</Title>}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Please input your full name!" },
                ]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input placeholder="john.doe@example.com" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
              >
                <Input placeholder="(123) 456-7890" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Shipping Address */}
        <Card title={<Title level={4}>Shipping Address</Title>}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="address"
                label="Street Address"
                rules={[
                  { required: true, message: "Please input your address!" },
                ]}
              >
                <Input placeholder="123 Nguyen Hue Street" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="city"
                label="City/Province"
                rules={[
                  {
                    required: true,
                    message: "Please input your city/province!",
                  },
                ]}
              >
                <Input placeholder="Ho Chi Minh City" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="district"
                label="District"
                rules={[
                  { required: true, message: "Please input your district!" },
                ]}
              >
                <Input placeholder="District 1" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="ward"
                label="Ward"
                rules={[{ required: true, message: "Please input your ward!" }]}
              >
                <Input placeholder="Ward 10" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Payment Method */}
        <Card title={<Title level={4}>Payment Method</Title>}>
          <Form.Item name="paymentMethod" label="Select Payment Method">
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Radio.Button value="momo" className="w-full text-center">
                    <div className="flex items-center justify-center gap-2">
                      <img src={momo} className="size-5"></img> Momo Wallet
                    </div>
                  </Radio.Button>
                </Col>
                <Col xs={24} sm={8}>
                  <Radio.Button value="vnpay" className="w-full text-center">
                    <div className="flex items-center justify-center gap-2">
                      <img src={vnpay} className="size-8"></img> VNPay
                    </div>
                  </Radio.Button>
                </Col>
                <Col xs={24} sm={8}>
                  <Radio.Button value="cod" className="w-full text-center ">
                    <div className="flex items-center justify-center gap-2">
                      <Banknote className="text-green-700"></Banknote> Cash on
                      Delivery
                    </div>
                  </Radio.Button>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>

          <div className="flex items-center text-xs text-gray-500 mt-4">
            <ShieldCheckIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Your payment information is processed securely</span>
          </div>
        </Card>
      </Form>
    </motion.div>
  );
}
